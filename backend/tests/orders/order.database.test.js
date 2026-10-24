import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import db from "../../src/config/db.js";
import { createOrderInTransaction } from "../../src/modules/orders/order.service.js";

describe("order transactions with PostgreSQL", () => {
  const createdUserIds = [];
  let productId;
  let userId;

  beforeAll(() => {
    expect(db.client.config.connection.database).toBe("electronics_shop_test");
  });

  beforeEach(async () => {
    const [user] = await db("users")
      .insert({
        first_name: "Integration",
        last_name: "Test",
        email: `integration-${Date.now()}-${Math.random()}@example.test`,
        password_hash: "not-used-by-this-test",
        role: "customer",
        is_verified: true,
      })
      .returning(["id"]);
    userId = user.id;
    createdUserIds.push(userId);

    const [product] = await db("products")
      .insert({
        name: `Integration Order Product ${userId}`,
        description: "Product created for order transaction tests",
        price: 25.5,
        stock: 4,
      })
      .returning(["id"]);
    productId = product.id;
  });

  afterEach(async () => {
    if (createdUserIds.length > 0) {
      await db("users").whereIn("id", createdUserIds).del();
      createdUserIds.length = 0;
    }
    if (productId) {
      await db("products").where({ id: productId }).del();
      productId = undefined;
    }
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("creates an order, decrements stock, clears the cart, and records a notification", async () => {
    await db("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity: 2,
    });

    const order = await createOrderInTransaction(
      userId,
      "123 Test Street",
      "cod"
    );

    const orderItems = await db("order_items").where({ order_id: order.id });
    const remainingStock = await db("products")
      .where({ id: productId })
      .first("stock");
    const remainingCartItems = await db("cart_items").where({ user_id: userId });
    const notification = await db("notifications")
      .where({ user_id: userId })
      .first();

    expect(Number(order.total_amount)).toBe(51);
    expect(orderItems).toHaveLength(1);
    expect(Number(orderItems[0].price)).toBe(25.5);
    expect(orderItems[0].quantity).toBe(2);
    expect(remainingStock.stock).toBe(2);
    expect(remainingCartItems).toHaveLength(0);
    expect(notification.message).toContain(`order #${order.id}`);
  });

  it("rolls back when cart quantity exceeds stock and keeps the cart intact", async () => {
    await db("products").where({ id: productId }).update({ stock: 1 });
    await db("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity: 2,
    });

    await expect(
      createOrderInTransaction(userId, "123 Test Street", "cod")
    ).rejects.toMatchObject({ statusCode: 409 });

    const orders = await db("orders").where({ user_id: userId });
    const remainingStock = await db("products")
      .where({ id: productId })
      .first("stock");
    const remainingCartItems = await db("cart_items").where({ user_id: userId });

    expect(orders).toHaveLength(0);
    expect(remainingStock.stock).toBe(1);
    expect(remainingCartItems).toHaveLength(1);
  });

  it("prevents two simultaneous checkouts from overselling the same product", async () => {
    await db("products").where({ id: productId }).update({ stock: 1 });
    const [secondUser] = await db("users")
      .insert({
        first_name: "Concurrent",
        last_name: "Customer",
        email: `integration-concurrent-${Date.now()}-${Math.random()}@example.test`,
        password_hash: "not-used-by-this-test",
        role: "customer",
        is_verified: true,
      })
      .returning(["id"]);
    createdUserIds.push(secondUser.id);

    await db("cart_items").insert([
      { user_id: userId, product_id: productId, quantity: 1 },
      { user_id: secondUser.id, product_id: productId, quantity: 1 },
    ]);

    const results = await Promise.allSettled([
      createOrderInTransaction(userId, "First Test Street", "cod"),
      createOrderInTransaction(secondUser.id, "Second Test Street", "cod"),
    ]);

    const successfulOrders = results.filter(
      (result) => result.status === "fulfilled"
    );
    const rejectedOrders = results.filter(
      (result) => result.status === "rejected"
    );
    const remainingStock = await db("products")
      .where({ id: productId })
      .first("stock");
    const orders = await db("orders").whereIn("user_id", [
      userId,
      secondUser.id,
    ]);
    const remainingCartItems = await db("cart_items").whereIn("user_id", [
      userId,
      secondUser.id,
    ]);

    expect(successfulOrders).toHaveLength(1);
    expect(rejectedOrders).toHaveLength(1);
    expect(rejectedOrders[0].reason.statusCode).toBe(409);
    expect(remainingStock.stock).toBe(0);
    expect(orders).toHaveLength(1);
    expect(remainingCartItems).toHaveLength(1);
  });
});
