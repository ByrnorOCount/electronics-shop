import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/modules/loyalty/loyalty.model.js", () => ({
  findEligibleOrderCounts: vi.fn(),
}));

import * as loyaltyModel from "../../src/modules/loyalty/loyalty.model.js";
import { addLoyaltyInfo } from "../../src/modules/loyalty/loyalty.service.js";

describe("loyalty service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loyaltyModel.findEligibleOrderCounts.mockResolvedValue([]);
  });

  it.each([
    [0, "Standard", "Silver", 2],
    [1, "Standard", "Silver", 1],
    [2, "Silver", "Premium", 3],
    [4, "Silver", "Premium", 1],
    [5, "Premium", null, null],
  ])(
    "assigns %s eligible orders to the expected tier and progress",
    async (orderCount, tier, nextTier, ordersToNextTier) => {
      loyaltyModel.findEligibleOrderCounts.mockResolvedValue([
        { user_id: 7, order_count: String(orderCount) },
      ]);

      const [user] = await addLoyaltyInfo([{ id: 7, role: "customer" }]);

      expect(user).toMatchObject({
        loyalty_tier: tier,
        loyalty_order_count: orderCount,
        loyalty_next_tier: nextTier,
        orders_to_next_tier: ordersToNextTier,
      });
    },
  );

  it("does not assign a loyalty tier to staff or admins", async () => {
    const users = await addLoyaltyInfo([
      { id: 1, role: "staff" },
      { id: 2, role: "admin" },
    ]);

    expect(users.map((user) => user.loyalty_tier)).toEqual([null, null]);
    expect(loyaltyModel.findEligibleOrderCounts).toHaveBeenCalledWith([]);
  });
});
