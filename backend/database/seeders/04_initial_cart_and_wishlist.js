/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Define a user ID to associate the data with.
  // This should correspond to a user created in the '03_initial_users.js' seeder.
  const userId = 3; // Assuming 'John Doe' has id 3

  // --- Inserts seed entries for cart_items ---
  await knex("cart_items").insert([
    {
      user_id: userId,
      product_id: 1, // Raspberry Pi 4 Model B 4GB
      quantity: 1,
    },
    {
      user_id: userId,
      product_id: 6, // Arduino UNO R4 WiFi
      quantity: 2,
    },
  ]);

  // --- Inserts seed entries for wishlists ---
  // The wishlists table likely just links a user_id to a product_id
  await knex("wishlists").insert([
    {
      user_id: userId,
      product_id: 9, // NVIDIA Jetson Nano Dev Kit
    },
    {
      user_id: userId,
      product_id: 30, // Raspberry Pi 5 8GB
    },
  ]);

  // Reset sequences if the tables have auto-incrementing primary keys.
  try {
    await knex.raw(
      "SELECT setval('cart_items_id_seq', (SELECT MAX(id) from \"cart_items\"));"
    );
  } catch (error) {
    console.error(
      "Could not reset 'cart_items_id_seq' sequence. This is expected if you are not using PostgreSQL or the table has no 'id' sequence.",
      error.message
    );
  }
}
