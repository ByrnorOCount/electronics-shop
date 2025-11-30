// backend/database/migrations/<timestamp>_create_newsletter_subscriptions_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("newsletter_subscriptions", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable("newsletter_subscriptions");
};
