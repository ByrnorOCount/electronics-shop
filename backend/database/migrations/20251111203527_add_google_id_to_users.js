/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.alterTable('users', (table) => {
        // Cột để lưu tên nhà cung cấp (vd: 'google', 'facebook', hoặc 'local' cho đăng ký thường)
        table.string('provider').defaultTo('local').notNullable();
        // Cột để lưu ID duy nhất từ nhà cung cấp (vd: Google User ID)
        table.string('provider_id');
        // Cho phép cột 'password_hash' được rỗng (nullable)
        // vì người dùng OAuth không có mật khẩu
        table.string('password_hash').nullable().alter();
        // Tạo một unique index để đảm bảo không có 2 user cùng provider và provider_id
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