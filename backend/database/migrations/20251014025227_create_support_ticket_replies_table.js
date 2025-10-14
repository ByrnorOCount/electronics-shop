/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('support_ticket_replies', (table) => {
    table.increments('id').primary();
    table.integer('ticket_id').unsigned().notNullable().references('id').inTable('support_tickets').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE'); // ID of the staff member replying
    table.text('message').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('support_ticket_replies');
};
