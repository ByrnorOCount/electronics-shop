/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // This seeder depends on users already being present.
  const userId = 3; // Assuming 'John Doe' has id 3

  // Deletes ALL existing entries from the support_tickets table
  await knex('support_tickets').del();

  // Inserts seed entries for support_tickets
  await knex('support_tickets').insert([
    {
      user_id: userId,
      subject: 'Question about Raspberry Pi 5 power supply',
      message: 'Hi, I saw the new Raspberry Pi 5 and I was wondering if the USB-C PD 65W Charger (Product ID 4) is compatible with it. What are the official power requirements? Thanks!',
      status: 'open',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]);

  // Reset the sequence for the id column.
  try {
    await knex.raw("SELECT setval('support_tickets_id_seq', (SELECT MAX(id) from \"support_tickets\"));");
  } catch (error) {
    console.error("Could not reset 'support_tickets_id_seq' sequence. This is expected if you are not using PostgreSQL.", error.message);
  }
}
