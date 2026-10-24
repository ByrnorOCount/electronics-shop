import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/products/product.service.js", () => ({
  getProducts: vi.fn(),
}));
vi.mock("../../src/modules/support/support.service.js", () => ({
  getFaqs: vi.fn(),
}));

import env from "../../src/config/env.js";
import * as productService from "../../src/modules/products/product.service.js";
import * as supportService from "../../src/modules/support/support.service.js";
import { reply } from "../../src/modules/chatbot/chatbot.service.js";

describe("chatbot service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    productService.getProducts.mockResolvedValue({
      products: [
        {
          name: "Laptop A",
          brand: "Electro",
          category_name: "Laptops",
          description: "Lightweight laptop",
          price: "900",
          stock: 4,
          internal_note: "not for the assistant",
        },
      ],
    });
    supportService.getFaqs.mockReturnValue([
      { question: "Shipping?", answer: "5-7 business days." },
    ]);
  });

  it("sends catalog and FAQ context to the configured local model", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: "Laptop A is in stock." } }),
    });

    const answer = await reply({
      message: "Compare this laptop",
      history: [{ role: "user", content: "I need something lightweight" }],
    });

    expect(answer).toBe("Laptop A is in stock.");
    expect(fetch).toHaveBeenCalledWith(
      `${env.OLLAMA_BASE_URL}/api/chat`,
      expect.objectContaining({ method: "POST" })
    );
    const payload = JSON.parse(fetch.mock.calls[0][1].body);
    expect(payload.model).toBe(env.OLLAMA_MODEL);
    expect(payload.stream).toBe(false);
    expect(payload.messages[0].content).toContain("Laptop A");
    expect(payload.messages[0].content).toContain("5-7 business days");
    expect(payload.messages[0].content).not.toContain("internal_note");
    expect(payload.messages.at(-1)).toEqual({
      role: "user",
      content: "Compare this laptop",
    });
  });

  it("returns a service-unavailable error when Ollama is unreachable", async () => {
    fetch.mockRejectedValue(new Error("connection refused"));

    await expect(reply({ message: "Recommend a laptop" })).rejects.toMatchObject(
      {
        statusCode: 503,
        message: expect.stringContaining("assistant is unavailable"),
      }
    );
  });
});