import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/products/product.model.js", () => ({
  count: vi.fn(),
  find: vi.fn(),
  findById: vi.fn(),
  findCategoryByName: vi.fn(),
  findAllCategories: vi.fn(),
}));

import * as productModel from "../../src/modules/products/product.model.js";
import * as productService from "../../src/modules/products/product.service.js";

describe("product service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps catalog filters and pagination to model queries", async () => {
    const products = [{ id: 1, name: "Laptop" }];
    productModel.findCategoryByName.mockResolvedValue({ id: 7, name: "Laptops" });
    productModel.count.mockResolvedValue(23);
    productModel.find.mockResolvedValue(products);

    const result = await productService.getProducts({
      search: "laptop",
      category: "Laptops",
      brand: "Contoso",
      featured: true,
      hide_out_of_stock: true,
      page: 3,
      limit: 10,
      sortBy: "price",
      sortOrder: "asc",
    });

    expect(productModel.count).toHaveBeenCalledWith({
      search: "laptop",
      category_id: 7,
      brand: "Contoso",
      is_featured: true,
      hide_out_of_stock: true,
    });
    expect(productModel.find).toHaveBeenCalledWith(
      {
        search: "laptop",
        category_id: 7,
        brand: "Contoso",
        is_featured: true,
        hide_out_of_stock: true,
      },
      { limit: 10, offset: 20 },
      { sortBy: "price", sortOrder: "asc" }
    );
    expect(result).toEqual({ products, page: 3, totalPages: 3 });
  });

  it("returns an empty listing when the requested category does not exist", async () => {
    productModel.findCategoryByName.mockResolvedValue(undefined);

    await expect(
      productService.getProducts({ category: "Unknown" })
    ).resolves.toEqual({ products: [], page: 1, totalPages: 0 });
    expect(productModel.count).not.toHaveBeenCalled();
    expect(productModel.find).not.toHaveBeenCalled();
  });

  it("raises a not-found error for a missing product", async () => {
    productModel.findById.mockResolvedValue(undefined);

    await expect(productService.getProductById("42")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
