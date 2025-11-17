/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.string("password_reset_token");
    table.timestamp("password_reset_expires");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("password_reset_token");
    table.dropColumn("password_reset_expires");
  });
};
