import db from "../../config/db.js";

export const findEligibleOrderCounts = (userIds) => {
  if (userIds.length === 0) {
    return Promise.resolve([]);
  }

  return db("orders")
    .select("user_id")
    .count({ order_count: "id" })
    .whereIn("user_id", userIds)
    .whereNot("status", "Cancelled")
    .groupBy("user_id");
};