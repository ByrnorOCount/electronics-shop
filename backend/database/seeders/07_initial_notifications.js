/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // This seeder depends on users already being present.
  const userId = 3; // Assuming 'John Doe' has id 3

  // Inserts seed entries for notifications
  await knex("notifications").insert([
    {
      user_id: userId,
      message:
        "Welcome to ElectroShop! Explore our featured products and find the best deals.",
      link: "/products?featured=true",
      is_read: true, // An older, already read notification
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      user_id: userId,
      message:
        "Your order has been shipped! You can view the details in your order history.",
      link: "/orders",
      is_read: false, // A new, unread notification
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      user_id: userId,
      message:
        "A staff member has replied to your support ticket regarding 'Question about Raspberry Pi 5...'",
      link: "/support",
      is_read: false, // A new, unread notification
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]);

  const customers = await knex("users")
    .where("role", "customer")
    .whereNot("id", userId)
    .orderBy("id", "asc");
  const activityMessages = [
    "Your order is being prepared for shipment.",
    "Your recent order has been delivered.",
    "An item on your wishlist is still available.",
    "Your support request has been received.",
  ];
  const activityNotifications = customers.map((customer, index) => ({
    user_id: customer.id,
    message: activityMessages[index % activityMessages.length],
    link: index % 2 === 0 ? "/orders" : "/support",
    is_read: index % 3 === 0,
    created_at: new Date(
      Date.now() - (index % 30) * 24 * 60 * 60 * 1000
    ),
  }));

  await knex("notifications").insert(activityNotifications);

  // Reset the sequence for the id column.
  try {
    await knex.raw(
      "SELECT setval('notifications_id_seq', (SELECT MAX(id) from \"notifications\"));"
    );
  } catch (error) {
    console.error(
      "Could not reset 'notifications_id_seq' sequence. This is expected if you are not using PostgreSQL.",
      error.message
    );
  }
}
