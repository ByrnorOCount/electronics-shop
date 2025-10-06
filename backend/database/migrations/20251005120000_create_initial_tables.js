// Obey openapi.yaml

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
      table.string('role').notNullable().defaultTo('Customer'); // e.g., 'Customer', 'Staff', 'Admin'
      table.timestamps(true, true);
    })
    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('category');
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').notNullable().defaultTo(0);
      table.string('image_url');
      table.boolean('is_featured').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.decimal('total_amount', 10, 2).notNullable();
      table.string('status').notNullable().defaultTo('Pending'); // e.g., 'Pending', 'Shipped', 'Delivered', 'Cancelled'
      table.text('shipping_address').notNullable();
      table.timestamps(true, true);
    })
    .createTable('order_items', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('SET NULL');
      table.integer('quantity').notNullable();
      table.decimal('price', 10, 2).notNullable(); // Price at the time of order
    })
    .createTable('cart_items', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);
      table.unique(['user_id', 'product_id']); // A user can only have one entry per product
    })
    .createTable('wishlists', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.unique(['user_id', 'product_id']);
    })
    .createTable('notifications', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('message').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('support_tickets', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('subject').notNullable();
      table.text('description').notNullable();
      table.string('status').notNullable().defaultTo('Open'); // e.g., 'Open', 'In Progress', 'Closed'
      table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  // Drop tables in reverse order of creation to avoid foreign key constraint errors
  return knex.schema
    .dropTableIfExists('support_tickets')
    .dropTableIfExists('notifications')
    .dropTableIfExists('wishlists')
    .dropTableIfExists('cart_items')
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
}
