import { beforeEach, describe, expect, it, vi } from "vitest";

import { researchProduct } from "../../src/modules/chatbot/webResearch.service.js";

describe("product web research", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("fetches and caches public reference extracts for a product", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          query: {
            search: [{ pageid: 97531, title: "RP2040" }],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          query: {
            pages: {
              97531: {
                title: "RP2040",
                fullurl: "https://en.wikipedia.org/wiki/RP2040",
                extract: "A dual-core microcontroller used in the Pico.",
              },
            },
          },
        }),
      });

    const product = {
      id: 97531,
      name: "Raspberry Pi Pico W",
      brand: "Raspberry Pi",
    };
    const firstResult = await researchProduct(product);
    const cachedResult = await researchProduct(product);

    expect(firstResult).toEqual([
      {
        title: "RP2040",
        url: "https://en.wikipedia.org/wiki/RP2040",
        extract: "A dual-core microcontroller used in the Pico.",
      },
    ]);
    expect(cachedResult).toEqual(firstResult);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      new URL(fetch.mock.calls[0][0]).searchParams.get("srsearch"),
    ).toContain("Raspberry Pi Pico W");
  });

  it("falls back to no external references when search is unavailable", async () => {
    fetch.mockRejectedValue(new Error("offline"));

    await expect(
      researchProduct({ id: 97532, name: "Arduino Uno", brand: "Arduino" }),
    ).resolves.toEqual([]);
  });
});
