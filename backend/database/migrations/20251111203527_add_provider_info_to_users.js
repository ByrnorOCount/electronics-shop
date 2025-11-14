/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.alterTable('users', (table) => {
        // Column to store the provider name (e.g., 'google', 'facebook', or 'local' for regular registration)
        table.string('provider').defaultTo('local').notNullable();
        // Column to store the unique ID from the provider (e.g., Google User ID)
        table.string('provider_id');
        // Allow the 'password_hash' column to be nullable
        // because OAuth users do not have a password.
        table.string('password_hash').nullable().alter();
        // Create a unique index to ensure no two users have the same provider and provider_id
        table.unique(['provider', 'provider_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.alterTable('users', (table) => {
        table.dropUnique(['provider', 'provider_id']);
        table.dropColumn('provider');
        table.dropColumn('provider_id');
        table.string('password_hash').notNullable().alter();
    });
};