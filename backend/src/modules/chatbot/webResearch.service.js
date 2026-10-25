import logger from "../../config/logger.js";

const CACHE_TTL_MS = 3 * 60 * 60 * 1000;
const CACHE_MISS_TTL_MS = 5 * 60 * 1000;
const researchCache = new Map();
const genericProductTerms = new Set([
  "raspberry",
  "arduino",
  "adafruit",
  "express",
  "board",
  "module",
  "wireless",
  "microcontroller",
]);

const getManufacturerReferences = (product) => {
  const name = product.name.toLowerCase();
  const references = [];

  if (name.includes("raspberry pi") && name.includes("pico")) {
    references.push({
      title: "Raspberry Pi Pico MicroPython documentation",
      url: "https://www.raspberrypi.com/documentation/microcontrollers/micropython.html",
      extract:
        "Official Raspberry Pi documentation for programming Pico boards with MicroPython, including setup and examples.",
    });
  }

  if (name.includes("arduino") && name.includes("uno r4")) {
    references.push({
      title: "Arduino UNO R4 WiFi documentation",
      url: "https://docs.arduino.cc/hardware/uno-r4-wifi/",
      extract:
        "Official Arduino board documentation with hardware specifications, setup, and programming resources.",
    });
  }

  if (name.includes("adafruit") && name.includes("feather m4")) {
    references.push({
      title: "Adafruit Feather M4 Express guide",
      url: "https://learn.adafruit.com/adafruit-feather-m4-express-atsamd51",
      extract:
        "Official Adafruit guide with board details, setup instructions, and CircuitPython examples.",
    });
  }

  return references;
};

const cleanSnippet = (snippet = "") =>
  snippet
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

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

  const manufacturerReferences = getManufacturerReferences(product);

  try {
    const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
    searchUrl.search = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: product.name,
      srlimit: "5",
      format: "json",
    });

    const searchData = await fetchJson(searchUrl);
    const distinctiveTerms = product.name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(
        (term) =>
          term.length > 2 &&
          !genericProductTerms.has(term) &&
          term !== product.brand?.toLowerCase(),
      );
    const results = (searchData.query?.search || [])
      .filter((result) => {
        const resultText =
          `${result.title} ${cleanSnippet(result.snippet)}`.toLowerCase();
        return distinctiveTerms.some((term) => resultText.includes(term));
      })
      .slice(0, 2);

    if (results.length === 0) {
      researchCache.set(product.id, {
        expiresAt:
          Date.now() +
          (manufacturerReferences.length ? CACHE_TTL_MS : CACHE_MISS_TTL_MS),
        results: manufacturerReferences,
      });
      return manufacturerReferences;
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
    const combinedResearch = [...manufacturerReferences, ...research];

    researchCache.set(product.id, {
      expiresAt:
        Date.now() +
        (combinedResearch.length ? CACHE_TTL_MS : CACHE_MISS_TTL_MS),
      results: combinedResearch,
    });

    return combinedResearch;
  } catch (error) {
    logger.warn("Product reference search failed", {
      productId: product.id,
      message: error.message,
    });
    return manufacturerReferences;
  }
};
