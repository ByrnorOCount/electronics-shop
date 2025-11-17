/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.alterTable("cart_items", (table) => {
    // Adds `created_at` and `updated_at` columns.
    // `created_at` defaults to the current time on insertion.
    // `updated_at` updates to the current time whenever the row is modified.
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.alterTable("cart_items", (table) => {
    table.dropTimestamps();
  });
};
