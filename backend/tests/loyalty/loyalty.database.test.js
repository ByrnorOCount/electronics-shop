import { afterAll, beforeAll, describe, expect, it } from "vitest";
import db from "../../src/config/db.js";
import { addLoyaltyInfo } from "../../src/modules/loyalty/loyalty.service.js";

describe("loyalty tiers with PostgreSQL", () => {
  const timestamp = Date.now();
  let userIds = [];

  beforeAll(async () => {
    expect(db.client.config.connection.database).toBe("electronics_shop_test");

    const users = await db("users")
      .insert([
        {
          first_name: "Silver",
          last_name: "Customer",
          email: `loyalty-silver-${timestamp}@example.test`,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
        {
          first_name: "Standard",
          last_name: "Customer",
          email: `loyalty-standard-${timestamp}@example.test`,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
        {
          first_name: "New",
          last_name: "Customer",
          email: `loyalty-new-${timestamp}@example.test`,
          password_hash: "not-used-by-this-test",
          role: "customer",
        },
      ])
      .returning(["id"]);
    userIds = users.map(({ id }) => id);

    await db("orders").insert([
      ...[1, 2, 3, 4].map(() => ({
        user_id: userIds[0],
        total_amount: 25,
        status: "Delivered",
        shipping_address: "Loyalty test address",
      })),
      {
        user_id: userIds[0],
        total_amount: 500,
        status: "Cancelled",
        shipping_address: "Loyalty test address",
      },
      {
        user_id: userIds[1],
        total_amount: 50,
        status: "Processing",
        shipping_address: "Loyalty test address",
      },
    ]);
  });

  afterAll(async () => {
    if (userIds.length > 0) {
      await db("users").whereIn("id", userIds).del();
    }
    await db.destroy();
  });

  it("counts non-cancelled orders and assigns customer tiers", async () => {
    const customers = userIds.map((id) => ({ id, role: "customer" }));
    const customersWithLoyalty = await addLoyaltyInfo(customers);

    expect(customersWithLoyalty).toMatchObject([
      {
        loyalty_tier: "Silver",
        loyalty_order_count: 4,
        loyalty_next_tier: "Premium",
        orders_to_next_tier: 1,
      },
      {
        loyalty_tier: "Standard",
        loyalty_order_count: 1,
        loyalty_next_tier: "Silver",
        orders_to_next_tier: 1,
      },
      {
        loyalty_tier: "Standard",
        loyalty_order_count: 0,
        loyalty_next_tier: "Silver",
        orders_to_next_tier: 2,
      },
    ]);
  });
});
