/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries from the categories table
  await knex('categories').del();

  // Inserts seed entries for categories
  await knex('categories').insert([
    { id: 1, name: 'Computers', description: 'Single-board computers and related hardware.' },
    { id: 2, name: 'Microcontrollers', description: 'Microcontroller units and development boards.' },
    { id: 3, name: 'Power', description: 'Batteries, power supplies, and chargers.' },
    { id: 4, name: 'Accessories', description: 'Cables, chargers, and other electronic accessories.' },
  ]);

  // Reset the sequence for the id column to start after the last inserted id.
  try {
    await knex.raw("SELECT setval('categories_id_seq', (SELECT MAX(id) from \"categories\"));");
  } catch (error) {
    console.error("Could not reset 'categories_id_seq' sequence. This is expected if you are not using PostgreSQL.", error.message);
  }
}
