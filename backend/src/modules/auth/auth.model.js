import db from '../../config/db.js';

/**
 * Finds a user by their email address.
 * @param {string} email - The user's email.
 * @returns {Promise<object|undefined>} The user object or undefined if not found.
 */
export const findByEmail = (email) => {
    return db('users').where({ email }).first();
};

/**
 * Finds a user by their social provider ID.
 * @param {string} provider - The name of the provider (e.g., 'google').
 * @param {string} providerId - The user's ID from the provider.
 * @returns {Promise<object|undefined>} The user object or undefined if not found.
 */
export const findByProvider = (provider, providerId) => {
    return db('users').where({ provider, provider_id: providerId }).first();
};

/**
 * Creates a new user.
 * @param {object} userData - The user data to insert.
 * @returns {Promise<object>} The newly created user object.
 */
export const create = async (userData) => {
    const [newUser] = await db('users').insert(userData).returning('*');
    return newUser;
};

/**
 * Updates a user by their ID.
 * @param {number} userId - The ID of the user to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated user object.
 */
export const update = async (userId, updateData) => {
    const [updatedUser] = await db('users').where({ id: userId }).update(updateData).returning('*');
    return updatedUser;
};
