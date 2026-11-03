import * as loyaltyModel from "./loyalty.model.js";

const getTierStatus = (orderCount) => {
  if (orderCount >= 5) {
    return {
      loyalty_tier: "Premium",
      loyalty_next_tier: null,
      orders_to_next_tier: null,
    };
  }

  if (orderCount >= 2) {
    return {
      loyalty_tier: "Silver",
      loyalty_next_tier: "Premium",
      orders_to_next_tier: 5 - orderCount,
    };
  }

  return {
    loyalty_tier: "Standard",
    loyalty_next_tier: "Silver",
    orders_to_next_tier: 2 - orderCount,
  };
};

export const addLoyaltyInfo = async (users) => {
  const customerIds = users
    .filter((user) => user.role?.toLowerCase() === "customer")
    .map((user) => user.id);
  const orderCounts = await loyaltyModel.findEligibleOrderCounts(customerIds);
  const countsByUserId = new Map(
    orderCounts.map(({ user_id, order_count }) => [
      String(user_id),
      Number(order_count),
    ]),
  );

  return users.map((user) => {
    if (user.role?.toLowerCase() !== "customer") {
      return {
        ...user,
        loyalty_tier: null,
        loyalty_order_count: null,
        loyalty_next_tier: null,
        orders_to_next_tier: null,
      };
    }

    const loyaltyOrderCount = countsByUserId.get(String(user.id)) ?? 0;
    return {
      ...user,
      loyalty_order_count: loyaltyOrderCount,
      ...getTierStatus(loyaltyOrderCount),
    };
  });
};
