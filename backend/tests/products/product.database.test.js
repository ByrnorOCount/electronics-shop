import { afterAll, beforeAll, describe, expect, it } from "vitest";
import db from "../../src/config/db.js";
import { getProducts } from "../../src/modules/products/product.service.js";

const createdProductIds = [];
let categoryId;
let categoryName;
let productNamePrefix;

describe("product service with PostgreSQL", () => {
  beforeAll(async () => {
    expect(db.client.config.connection.database).toBe("electronics_shop_test");

    productNamePrefix = `Integration Product ${Date.now()} ${process.pid}`;
    categoryName = `Integration Category ${Date.now()} ${process.pid}`;
    const [category] = await db("categories")
      .insert({ name: categoryName })
      .returning(["id"]);
    categoryId = category.id;

    const products = await db("products")
      .insert([
        {
          name: `${productNamePrefix} A`,
          description: "First integration test product",
          price: 89.99,
          stock: 5,
          category_id: categoryId,
          is_featured: true,
        },
        {
          name: `${productNamePrefix} B`,
          description: "Second integration test product",
          price: 120.5,
          stock: 0,
          category_id: categoryId,
          is_featured: false,
        },
      ])
      .returning(["id"]);
    createdProductIds.push(...products.map((product) => product.id));
  });

  afterAll(async () => {
    if (createdProductIds.length > 0) {
      await db("products").whereIn("id", createdProductIds).del();
    }
    if (categoryId) {
      await db("categories").where({ id: categoryId }).del();
    }
    await db.destroy();
  });

  it("filters by search and category and paginates database results", async () => {
    const result = await getProducts({
      search: productNamePrefix,
      category: categoryName,
      page: 1,
      limit: 1,
      sortBy: "name",
      sortOrder: "asc",
    });

    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe(`${productNamePrefix} A`);
    expect(result.products[0].category_name).toContain("Integration Category");
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(2);
  });
});
