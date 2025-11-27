/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  const users = await knex("users").where("role", "customer");
  if (users.length === 0) {
    console.warn("No customer users found to create support tickets for.");
    return;
  }

  const ticketsToInsert = [];
  const statuses = ["Open", "In Progress", "Closed"];
  const subjects = [
    "Question about product compatibility",
    "Issue with my recent order",
    "Shipping time inquiry",
    "Return request for item",
    "Problem with payment",
  ];
  const messages = [
    "Hello, I'm having an issue with my order. Can you please help?",
    "I'd like to know if product A is compatible with product B.",
    "How long will it take for my order to arrive?",
    "I need to return an item from my last purchase. What is the process?",
    "My payment was declined but I'm not sure why. Can you check?",
  ];

  for (let i = 0; i < 15; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);

    ticketsToInsert.push({
      user_id: user.id,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  await knex("support_tickets").insert(ticketsToInsert);

  // Reset the sequence for the id column.
  try {
    await knex.raw(
      "SELECT setval('support_tickets_id_seq', (SELECT MAX(id) from \"support_tickets\"));"
    );
  } catch (error) {
    console.error(
      "Could not reset 'support_tickets_id_seq' sequence. This is expected if you are not using PostgreSQL.",
      error.message
    );
  }
}
