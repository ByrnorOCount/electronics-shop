/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('role').notNullable().defaultTo('Customer'); // e.g., 'Customer', 'Administrator'
      table.timestamps(true, true);
    })
    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('category');
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock_quantity').notNullable().defaultTo(0);
      table.string('image_url');
      table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  // Drop tables in reverse order of creation to avoid foreign key constraints
  return knex.schema.dropTableIfExists('products').dropTableIfExists('users');
}
