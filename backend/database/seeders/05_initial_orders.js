/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // This seeder depends on users and products already being present.
  const userId = 3; // Assuming 'John Doe' has id 3

  // Deletes ALL existing entries from orders and order_items tables
  // The order of deletion is important due to foreign key constraints.
  await knex('order_items').del();
  await knex('orders').del();

  // --- Inserts seed entries for orders ---
  const [order1] = await knex('orders').insert([
    {
      user_id: userId,
      total_amount: 32.49,
      shipping_address: '123 Main St, Anytown, USA 12345',
      status: 'Delivered',
      payment_method: 'cod',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  ]).returning('id');

  const [order2] = await knex('orders').insert([
    {
      user_id: userId,
      total_amount: 15.49,
      shipping_address: '123 Main St, Anytown, USA 12345',
      status: 'Shipped',
      payment_method: 'stripe',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ]).returning('id');

  // --- Inserts seed entries for order_items ---
  await knex('order_items').insert([
    // Items for Order 1
    {
      order_id: order1.id,
      product_id: 2, // ESP32 Dev Module
      quantity: 1,
      price: 6.50, // Price at the time of purchase
    },
    {
      order_id: order1.id,
      product_id: 4, // USB-C PD 65W Charger
      quantity: 1,
      price: 24.00,
    },
    // Items for Order 2
    {
      order_id: order2.id,
      product_id: 17, // Raspberry Pi Pico W
      quantity: 1,
      price: 6.00,
    },
    {
      order_id: order2.id,
      product_id: 8, // Breadboard (830-point)
      quantity: 1,
      price: 5.50,
    },
  ]);

  // Reset sequences for the tables.
  try {
    await knex.raw("SELECT setval('orders_id_seq', (SELECT MAX(id) from \"orders\"));");
    await knex.raw("SELECT setval('order_items_id_seq', (SELECT MAX(id) from \"order_items\"));");
  } catch (error) {
    console.error("Could not reset order sequences. This is expected if you are not using PostgreSQL.", error.message);
  }
}
