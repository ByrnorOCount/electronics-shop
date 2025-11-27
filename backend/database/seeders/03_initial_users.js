import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Hash a common password
  const hashedPassword = await bcrypt.hash("Password123!", 12);

  // --- Define all users to be inserted ---
  const usersToInsert = [
    {
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password_hash: hashedPassword,
      role: "admin",
      is_verified: true,
    },
    {
      first_name: "Staff",
      last_name: "User",
      email: "staff@example.com",
      password_hash: hashedPassword,
      role: "staff",
      is_verified: true,
    },
    {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password_hash: hashedPassword,
      role: "customer",
      is_verified: true,
    },
  ];

  // --- Add more users for analytics ---
  const providers = ["local", "google", "facebook"];
  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 30); // Random day in the last 30 days
    const provider = providers[Math.floor(Math.random() * providers.length)];

    const user = {
      first_name: `Customer${i + 1}`,
      last_name: "Test",
      email: `customer${i + 1}@example.com`,
      role: "customer",
      is_verified: true,
      created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      provider: provider,
    };

    if (provider === "local") {
      user.password_hash = hashedPassword;
    } else {
      // Social logins don't have a local password.
      // Generate a random string for provider_id for seeding purposes.
      user.provider_id = Math.random().toString(36).substring(2, 15);
    }
    usersToInsert.push(user);
  }

  // Insert all users in a single batch
  await knex("users").insert(usersToInsert);

  // Reset the sequence for the id column to start after the last inserted id.
  // This is good practice to avoid primary key conflicts if you manually insert users.
  // The exact command can vary slightly by SQL dialect (PostgreSQL vs. others).
  try {
    await knex.raw(
      "SELECT setval('users_id_seq', (SELECT MAX(id) from \"users\"));"
    );
  } catch (error) {
    console.error(
      "Could not reset 'users_id_seq' sequence. This is expected if you are not using PostgreSQL.",
      error.message
    );
  }
}
