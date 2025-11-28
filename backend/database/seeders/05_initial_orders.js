/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // --- Generate a large number of orders for analytics ---
  const users = await knex("users").where("role", "customer");
  const products = await knex("products").select("id", "price", "stock");
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // --- Create items for a temporary order ---
    const numItems = Math.floor(Math.random() * 5) + 1; // 1 to 5 items per order
    let totalAmount = 0;
    const tempOrderItems = [];
    const stockUpdates = [];

    await knex.transaction(async (trx) => {
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        // Ensure we don't "order" more than is available in stock
        const quantity = Math.min(
          Math.floor(Math.random() * 3) + 1,
          product.stock
        );

        if (quantity === 0) continue; // Skip if product is out of stock

        const price = parseFloat(product.price);
        totalAmount += price * quantity;

        tempOrderItems.push({
          product_id: product.id,
          quantity: quantity,
          price: price,
        });

        // Prepare the stock update operation
        stockUpdates.push(
          trx("products").where("id", product.id).decrement("stock", quantity)
        );
      }

      if (tempOrderItems.length === 0) return; // Don't create an empty order

      // --- Insert the order and get its ID ---
      const [newOrder] = await trx("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount.toFixed(2),
          shipping_address: `${user.first_name}'s Address, Anytown, USA`,
          status: status,
          payment_method: Math.random() > 0.5 ? "cod" : "stripe",
          created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        })
        .returning("id");

      // --- Assign the new order's ID to its items and insert them ---
      const orderItemsToInsert = tempOrderItems.map((item) => ({
        ...item,
        order_id: newOrder.id,
      }));
      await trx("order_items").insert(orderItemsToInsert);

      // --- Execute all stock updates ---
      await Promise.all(stockUpdates);
    });
  }

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
