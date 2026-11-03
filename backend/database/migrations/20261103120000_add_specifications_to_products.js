/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.alterTable("products", (table) => {
    table
      .jsonb("specifications")
      .notNullable()
      .defaultTo(knex.raw("'{}'::jsonb"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("specifications");
  });
};