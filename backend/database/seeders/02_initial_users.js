import bcrypt from 'bcrypt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries from the users table
  await knex('users').del();

  // Hash a common password
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Inserts seed entries for users with different roles
  await knex('users').insert([
    {
      id: 1,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
    {
      id: 2,
      first_name: 'Staff',
      last_name: 'User',
      email: 'staff@example.com',
      password_hash: hashedPassword,
      role: 'staff',
    },
    {
      id: 3,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password_hash: hashedPassword,
      role: 'customer',
    },
  ]);

  // Reset the sequence for the id column to start after the last inserted id.
  // This is good practice to avoid primary key conflicts if you manually insert users.
  // The exact command can vary slightly by SQL dialect (PostgreSQL vs. others).
  try {
    await knex.raw('SELECT setval(\'users_id_seq\', (SELECT MAX(id) from "users"));');
  } catch (error) {
    console.error("Could not reset 'users_id_seq' sequence. This is expected if you are not using PostgreSQL.", error.message);
  }
}
