/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('is_verified').defaultTo(false);
    table.string('email_verification_token');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('is_verified');
    table.dropColumn('email_verification_token');
  });
};
