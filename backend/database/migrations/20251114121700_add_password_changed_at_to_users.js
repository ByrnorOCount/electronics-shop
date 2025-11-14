/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.table('users', function (table) {
        // This column will store the timestamp of the last password change.
        // It allows us to invalidate JWTs issued before a password update.
        table.timestamp('password_changed_at');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.table('users', function (table) {
        table.dropColumn('password_changed_at');
    });
}
