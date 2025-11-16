import db from '../../config/db.js';

/**
 * Finds a user by their email address.
 * @param {string} email - The user's email.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findByEmail = (email) => {
    return db('users').where({ email }).first();
};

/**
 * Finds a user by email and a specific provider.
 * @param {string} email - The user's email.
 * @param {string} provider - The authentication provider (e.g., 'local').
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findByEmailAndProvider = (email, provider) => {
    return db('users').where({ email, provider }).first();
};

/**
 * Creates a new user.
 * @param {object} userData - The data for the new user.
 * @returns {Promise<object>} The newly created user object.
 */
export const create = async (userData) => {
    const [user] = await db('users').insert(userData).returning('*');
    return user;
};

/**
 * Finds a user by their ID.
 * @param {number} id - The user's ID.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findById = (id) => {
    return db('users').where({ id }).first();
};

/**
 * Updates a user's profile information.
 * @param {number} id - The user's ID.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object>} The updated user object.
 */
export const update = async (id, updateData) => {
    const [updatedUser] = await db('users').where({ id }).update(updateData).returning(['id', 'first_name', 'last_name', 'email', 'role']);
    return updatedUser;
};

/**
 * Finds a user by their email verification token.
 * @param {string} token - The hashed verification token.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findByVerificationToken = (token) => {
    return db('users').where({ email_verification_token: token }).first();
};

/**
 * Verifies a user's email and clears the token.
 * @param {number} id - The user's ID.
 * @returns {Promise<number>} The number of updated rows.
 */
export const verifyUser = (id) => {
    return db('users').where({ id }).update({
        is_verified: true,
        email_verification_token: null,
    });
};

/**
 * Finds a user by a valid password reset token.
 * @param {string} hashedToken - The hashed reset token.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findByResetToken = (hashedToken) => {
    return db('users')
        .where({ password_reset_token: hashedToken })
        .andWhere('password_reset_expires', '>', db.raw('NOW()'))
        .first();
};

/**
 * Updates a user's record with a password reset token and expiration.
 * @param {number} id - The user's ID.
 * @param {string} hashedToken - The hashed token to store.
 */
export const setResetToken = (id, hashedToken) => {
    return db('users').where({ id }).update({
        password_reset_token: hashedToken,
        password_reset_expires: db.raw("NOW() + INTERVAL '1 hour'"),
    });
};

/**
 * Finds a user by their OAuth provider and provider-specific ID.
 * @param {string} provider - The OAuth provider (e.g., 'google', 'facebook').
 * @param {string} providerId - The user's ID from the provider.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findByProvider = (provider, providerId) => {
    return db('users').where({ provider, provider_id: providerId }).first();
};
