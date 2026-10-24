import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../../src/modules/products/product.service.js", () => ({
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  getProductCategories: vi.fn(),
}));

import app from "../../src/app.js";
import * as productService from "../../src/modules/products/product.service.js";

describe("product routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the product listing response", async () => {
    const result = {
      products: [{ id: 1, name: "Laptop", price: 1200 }],
      page: 1,
      totalPages: 1,
    };
    productService.getProducts.mockResolvedValue(result);

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: result,
      message: "Products retrieved successfully.",
    });
    expect(productService.getProducts).toHaveBeenCalledOnce();
  });

  it("rejects unsupported product sort fields before calling the service", async () => {
    const response = await request(app).get(
      "/api/products?sortBy=untrusted_column"
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(productService.getProducts).not.toHaveBeenCalled();
  });

  it("rejects a non-numeric product id before calling the service", async () => {
    const response = await request(app).get("/api/products/not-a-number");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(productService.getProductById).not.toHaveBeenCalled();
  });

  it("returns product categories", async () => {
    const categories = [{ id: 4, name: "Laptops" }];
    productService.getProductCategories.mockResolvedValue(categories);

    const response = await request(app).get("/api/products/categories");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(categories);
    expect(productService.getProductCategories).toHaveBeenCalledOnce();
  });
});
