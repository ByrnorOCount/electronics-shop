/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries from orders and order_items tables
  // The order of deletion is important due to foreign key constraints.
  await knex("order_items").del();
  await knex("orders").del();

  // --- Generate a large number of orders for analytics ---
  const users = await knex("users").where("role", "customer");
  const products = await knex("products").select("id", "price");
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const ordersToInsert = [];
  const orderItemsToInsert = [];

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Create items for this order
    const numItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items per order
    let totalAmount = 0;
    const tempOrderItems = [];

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 quantity
      totalAmount += parseFloat(product.price) * quantity;

      tempOrderItems.push({
        order_id: i + 1, // Temporary ID, will be correct after insertion
        product_id: product.id,
        quantity: quantity,
        price: product.price,
      });
    }

    ordersToInsert.push({
      id: i + 1,
      user_id: user.id,
      total_amount: totalAmount.toFixed(2),
      shipping_address: `${user.first_name}'s Address, Anytown, USA`,
      status: status,
      payment_method: Math.random() > 0.5 ? "cod" : "stripe",
      created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
    orderItemsToInsert.push(...tempOrderItems);
  }

  await knex("orders").insert(ordersToInsert);
  await knex("order_items").insert(orderItemsToInsert);

  // Reset sequences for the tables.
  try {
    await knex.raw(
      "SELECT setval('orders_id_seq', (SELECT MAX(id) from \"orders\"));"
    );
    await knex.raw(
      "SELECT setval('order_items_id_seq', (SELECT MAX(id) from \"order_items\"));"
    );
  } catch (error) {
    console.error(
      "Could not reset order sequences. This is expected if you are not using PostgreSQL.",
      error.message
    );
  }
}
