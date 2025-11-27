/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async (knex) => {
  // This master seeder runs all other seeders in the correct order.
  // To use, run: `knex seed:run --specific=_run_all.js`
  // Mainly for gemini, you can just run npm run seed after cd backend

  // Import and execute each seeder function.
  const { seed: cleanup } = await import("./00_cleanup.js");
  const { seed: initialCategories } = await import(
    "./01_initial_categories.js"
  );
  const { seed: initialProducts } = await import("./02_initial_products.js");
  const { seed: initialUsers } = await import("./03_initial_users.js");
  const { seed: initialCartAndWishlist } = await import(
    "./04_initial_cart_and_wishlist.js"
  );
  const { seed: initialOrders } = await import("./05_initial_orders.js");
  const { seed: initialSupportTickets } = await import(
    "./06_initial_support_tickets.js"
  );
  const { seed: initialNotifications } = await import(
    "./07_initial_notifications.js"
  );

  // Chain the seeders
  await cleanup(knex);
  await Promise.all([initialCategories(knex), initialUsers(knex)]); // Categories and Users can run in parallel
  await initialProducts(knex); // Products depend on Categories
  await Promise.all([
    initialCartAndWishlist(knex),
    initialOrders(knex),
    initialSupportTickets(knex),
    initialNotifications(knex),
  ]);
};
