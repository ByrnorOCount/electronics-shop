/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.string("payment_method").notNullable().defaultTo("cod");
    table.jsonb("payment_details").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("payment_method");
    table.dropColumn("payment_details");
  });
};
