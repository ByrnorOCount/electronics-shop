/**
 * This seed file runs first to clean up transactional data tables.
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // List of tables to truncate. Order matters due to foreign key constraints.
  // Tables with foreign keys pointing to other tables should be truncated first.
  const tablesToTruncate = [
    'order_items',
    'cart_items',
    'wishlists',
    'support_tickets',
    'notifications',
    'orders',
  ];

  for (const table of tablesToTruncate) {
    // Using TRUNCATE ... RESTART IDENTITY is efficient for PostgreSQL
    // and resets the auto-incrementing IDs.
    await knex.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }
}
