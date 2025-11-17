/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // 1. Create the new categories table
  await knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.text("description");
    table.timestamps(true, true);
  });

  // 2. Add the new category_id column to products
  await knex.schema.alterTable("products", (table) => {
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL");
  });

  // 3. (Optional but recommended) Drop the old 'category' column
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("category");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // Reverse the operations
  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("category_id");
    table.string("category"); // Add back the old column
  });

  await knex.schema.dropTableIfExists("categories");
};
