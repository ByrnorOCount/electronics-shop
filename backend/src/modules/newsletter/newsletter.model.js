import db from "../../config/db.js";

const subscribe = async (email) => {
  // Use 'onConflict' to gracefully handle attempts to subscribe an existing email
  const [subscription] = await db("newsletter_subscriptions")
    .insert({ email })
    .onConflict("email")
    .ignore()
    .returning("*");
  return subscription;
};

export default {
  subscribe,
};
