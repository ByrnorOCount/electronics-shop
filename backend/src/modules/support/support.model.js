import db from '../../config/db.js';

/**
 * Creates a new support ticket.
 * @param {object} ticketData - The data for the new ticket.
 * @returns {Promise<object>} The newly created ticket object.
 */
export const create = async (ticketData) => {
    const [newTicket] = await db('support_tickets').insert(ticketData).returning('*');
    return newTicket;
};

/**
 * Finds all support tickets for a specific user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of the user's support tickets.
 */
export const findByUserId = (userId) => {
    return db('support_tickets')
        .where({ user_id: userId })
        .orderBy('created_at', 'desc');
};

/**
 * Finds a single support ticket by its ID and owner's ID.
 * @param {number} ticketId - The ID of the ticket.
 * @param {number} userId - The ID of the user who owns the ticket.
 * @returns {Promise<object|undefined>} The ticket object or undefined if not found.
 */
export const findByIdAndUserId = (ticketId, userId) => {
    return db('support_tickets')
        .where({ id: ticketId, user_id: userId })
        .first();
};
