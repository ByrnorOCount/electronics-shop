import db from "../../config/db.js";

/**
 * Creates a new support ticket.
 * @param {object} ticketData - The data for the new ticket.
 * @returns {Promise<object>} The newly created ticket object.
 */
export const create = async (ticketData) => {
  const [newTicket] = await db("support_tickets")
    .insert(ticketData)
    .returning("*");
  return newTicket;
};

/**
 * Finds all support tickets for a specific user.
 * @param {number} userId - The ID of the user.
 * @param {object} filter - Knex filter object.
 * @returns {Promise<Array>} An array of the user's support tickets.
 */
export const findByUserId = (userId, filter = {}) => {
  return db("support_tickets")
    .where({ user_id: userId })
    .where(filter)
    .orderBy("created_at", "desc");
};

/**
 * Finds a single support ticket by its ID and owner's ID.
 * @param {number} ticketId - The ID of the ticket.
 * @param {number} userId - The ID of the user who owns the ticket.
 * @returns {Promise<object|undefined>} The ticket object or undefined if not found.
 */
export const findByIdAndUserId = (ticketId, userId) => {
  return db("support_tickets").where({ id: ticketId, user_id: userId }).first();
};

/**
 * Finds a single support ticket by its ID.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<object|undefined>} The ticket object or undefined if not found.
 */
export const findById = (ticketId) => {
  return db("support_tickets").where({ id: ticketId }).first();
};

/**
 * Updates a support ticket.
 * @param {number} ticketId - The ID of the ticket to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated ticket object.
 */
export const update = (ticketId, updateData) => {
  return db("support_tickets")
    .where({ id: ticketId })
    .update(updateData)
    .returning("*");
};

/**
 * Finds all replies for a given support ticket.
 * It also joins with the users table to get the author's name.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<Array>} An array of reply objects.
 */
export const findRepliesByTicketId = (ticketId) => {
  return db("support_ticket_replies as r")
    .join("users as u", "r.user_id", "u.id")
    .select(
      "r.id",
      "r.ticket_id",
      "r.user_id",
      "r.message",
      "r.created_at",
      db.raw("CONCAT(u.first_name, ' ', u.last_name) as author_name"),
      "u.role as author_role"
    )
    .where("r.ticket_id", ticketId)
    .orderBy("r.created_at", "asc");
};

/**
 * Finds the author of the original support ticket.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<object|undefined>} The author's details.
 */
export const findTicketAuthor = (ticketId) => {
  return db("support_tickets as st")
    .join("users as u", "st.user_id", "u.id")
    .select(
      db.raw("CONCAT(u.first_name, ' ', u.last_name) as author_name"),
      "u.role as author_role"
    )
    .where("st.id", ticketId)
    .first();
};

/**
 * Creates a new reply for a support ticket.
 * @param {object} replyData - The data for the new reply.
 * @returns {Promise<object>} The newly created reply object.
 */
export const createReply = async (replyData) => {
  const [newReply] = await db("support_ticket_replies")
    .insert(replyData)
    .returning("*");
  return newReply;
};
