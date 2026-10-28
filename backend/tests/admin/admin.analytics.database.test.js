import { afterAll, beforeAll, describe, expect, it } from "vitest";
import db from "../../src/config/db.js";
import { fetchAnalyticsData } from "../../src/modules/admin/admin.model.js";

describe("admin analytics with PostgreSQL", () => {
  const timestamp = Date.now();
  const email = `analytics-${timestamp}@example.test`;
  const categoryNames = [`Analytics A ${timestamp}`, `Analytics B ${timestamp}`];
  const productNames = [`Analytics Product A ${timestamp}`, `Analytics Product B ${timestamp}`];
  let userIds = [];
  let categoryIds = [];
  let productIds = [];

  beforeAll(async () => {
    expect(db.client.config.connection.database).toBe("electronics_shop_test");

    const users = await db("users")
      .insert([
        {
          first_name: "Top",
          last_name: "Customer",
          email,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
        {
          first_name: "Repeat",
          last_name: "Customer",
          email: `repeat-${timestamp}@example.test`,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
        {
          first_name: "Loyal",
          last_name: "Customer",
          email: `loyal-${timestamp}@example.test`,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
      ])
      .returning(["id"]);
    userIds = users.map(({ id }) => id);

    const categories = await db("categories")
      .insert(categoryNames.map((name) => ({ name })))
      .returning(["id"]);
    categoryIds = categories.map(({ id }) => id);

    const products = await db("products")
      .insert([
        {
          name: productNames[0],
          price: 10,
          stock: 20,
          category_id: categoryIds[0],
        },
        {
          name: productNames[1],
          price: 20,
          stock: 20,
          category_id: categoryIds[1],
        },
      ])
      .returning(["id"]);
    productIds = products.map(({ id }) => id);

    const orderRows = await db("orders")
      .insert([
        {
          user_id: userIds[0],
          total_amount: 20,
          status: "Delivered",
          shipping_address: "Analytics test address",
          created_at: "2099-01-10T12:00:00Z",
          updated_at: "2099-01-10T12:00:00Z",
        },
        {
          user_id: userIds[0],
          total_amount: 100,
          status: "Cancelled",
          shipping_address: "Analytics test address",
          created_at: "2099-01-11T12:00:00Z",
          updated_at: "2099-01-11T12:00:00Z",
        },
        {
          user_id: userIds[0],
          total_amount: 30,
          status: "Delivered",
          shipping_address: "Analytics test address",
          created_at: "2099-01-15T12:00:00Z",
          updated_at: "2099-01-15T12:00:00Z",
        },
        {
          user_id: userIds[1],
          total_amount: 60,
          status: "Processing",
          shipping_address: "Analytics test address",
          created_at: "2099-01-20T12:00:00Z",
          updated_at: "2099-01-20T12:00:00Z",
        },
        {
          user_id: userIds[0],
          total_amount: 160,
          status: "Delivered",
          shipping_address: "Analytics test address",
          created_at: "2098-12-31T12:00:00Z",
          updated_at: "2098-12-31T12:00:00Z",
        },
        ...[2, 3, 4, 5, 6].map((day) => ({
          user_id: userIds[2],
          total_amount: 10,
          status: "Delivered",
          shipping_address: "Analytics test address",
          created_at: `2099-01-${String(day).padStart(2, "0")}T12:00:00Z`,
          updated_at: `2099-01-${String(day).padStart(2, "0")}T12:00:00Z`,
        })),
      ])
      .returning(["id"]);

    await db("order_items").insert([
      { order_id: orderRows[0].id, product_id: productIds[0], quantity: 2, price: 10 },
      { order_id: orderRows[1].id, product_id: productIds[0], quantity: 10, price: 10 },
      { order_id: orderRows[2].id, product_id: productIds[1], quantity: 3, price: 20 },
      { order_id: orderRows[4].id, product_id: productIds[1], quantity: 8, price: 20 },
    ]);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db("users").whereIn("id", userIds).del();
    }
    if (productIds.length > 0) {
      await db("products").whereIn("id", productIds).del();
    }
    if (categoryIds.length > 0) {
      await db("categories").whereIn("id", categoryIds).del();
    }
    await db.destroy();
  });

  it("returns date-filtered product/category sales and customer purchase segments", async () => {
    const data = await fetchAnalyticsData({
      startDate: "2099-01-01T00:00:00Z",
      endDate: "2099-01-31T23:59:59Z",
    });

    expect(data.topProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: productNames[0],
          total_quantity: 2,
          total_sales: "20.00",
        }),
        expect.objectContaining({
          name: productNames[1],
          total_quantity: 3,
          total_sales: "60.00",
        }),
      ])
    );
    expect(data.salesByCategory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: categoryNames[0], total_sales: "20.00" }),
        expect.objectContaining({ name: categoryNames[1], total_sales: "60.00" }),
      ])
    );
    expect(data.topCustomers[0]).toMatchObject({
      id: userIds[1],
      email: `repeat-${timestamp}@example.test`,
      order_count: 1,
      total_spent: "60.00",
    });
    expect(Number(data.topCustomers[0].average_order_value)).toBe(60);
    expect(data.customerSegments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ segment: "One-time", customer_count: 1 }),
        expect.objectContaining({ segment: "Repeat", customer_count: 1 }),
        expect.objectContaining({ segment: "Loyal", customer_count: 1 }),
      ])
    );
  });
});