import logger from "../../config/logger.js";

const CACHE_TTL_MS = 3 * 60 * 60 * 1000;
const CACHE_MISS_TTL_MS = 5 * 60 * 1000;
const researchCache = new Map();

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "ElectroShopLocalAssistant/1.0 (product research)",
    },
    signal: AbortSignal.timeout(7000),
  });

  if (!response.ok) {
    throw new Error(`Wikipedia API returned HTTP ${response.status}`);
  }

  return response.json();
};

export const researchProduct = async (product) => {
  const cached = researchCache.get(product.id);
  if (cached && cached.expiresAt > Date.now()) return cached.results;

  try {
    const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
    searchUrl.search = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: `${product.name} ${product.brand || ""} electronics specifications`,
      srlimit: "3",
      format: "json",
    });

    const searchData = await fetchJson(searchUrl);
    const results = searchData.query?.search || [];
    if (results.length === 0) {
      researchCache.set(product.id, {
        expiresAt: Date.now() + CACHE_MISS_TTL_MS,
        results: [],
      });
      return [];
    }

    const detailsUrl = new URL("https://en.wikipedia.org/w/api.php");
    detailsUrl.search = new URLSearchParams({
      action: "query",
      prop: "extracts|info",
      explaintext: "1",
      exchars: "1800",
      inprop: "url",
      pageids: results.map((result) => result.pageid).join("|"),
      format: "json",
    });

    const detailsData = await fetchJson(detailsUrl);
    const research = Object.values(detailsData.query?.pages || {})
      .filter((page) => page.extract && page.fullurl)
      .map((page) => ({
        title: page.title,
        url: page.fullurl,
        extract: page.extract,
      }));

    researchCache.set(product.id, {
      expiresAt:
        Date.now() + (research.length ? CACHE_TTL_MS : CACHE_MISS_TTL_MS),
      results: research,
    });

    return research;
  } catch (error) {
    logger.warn("Product reference search failed", {
      productId: product.id,
      message: error.message,
    });
    return [];
  }
};
