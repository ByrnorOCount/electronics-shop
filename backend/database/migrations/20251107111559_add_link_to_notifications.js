/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('notifications', (table) => {
    // Add a new string column to store a URL link for the notification.
    table.string('link');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('notifications', (table) => {
    table.dropColumn('link');
  });
}
