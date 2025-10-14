/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.alterTable('users', (table) => {
    table.string('otp_hash');
    table.timestamp('otp_expires');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('otp_hash');
    table.dropColumn('otp_expires');
  });
};
