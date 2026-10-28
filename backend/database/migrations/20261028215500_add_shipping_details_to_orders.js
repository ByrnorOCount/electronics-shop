/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.decimal("shipping_fee", 10, 2).notNullable().defaultTo(0);
    table.string("delivery_zone");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("delivery_zone");
    table.dropColumn("shipping_fee");
  });
};
