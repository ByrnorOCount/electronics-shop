import db from '../../config/db.js';

/**
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @returns {Promise<object>} The newly created product object.
 */
export const createProduct = async (productData) => {
    const [newProduct] = await db('products').insert(productData).returning('*');
    return newProduct;
};

/**
 * Updates an existing product.
 * @param {number} productId - The ID of the product to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object|undefined>} The updated product object or undefined if not found.
 */
export const updateProduct = async (productId, updateData) => {
    const [updatedProduct] = await db('products').where({ id: productId }).update(updateData).returning('*');
    return updatedProduct;
};

/**
 * Deletes a product.
 * @param {number} productId - The ID of the product to delete.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deleteProduct = (productId) => {
    return db('products').where({ id: productId }).del();
};

/**
 * Finds all products.
 * @returns {Promise<Array>} An array of all product objects.
 */
export const findAllProducts = () => {
    return db('products').orderBy('id', 'asc');
};

/**
 * Finds all orders.
 * @returns {Promise<Array>} An array of all order objects.
 */
export const findAllOrders = () => {
    return db('orders').orderBy('created_at', 'desc');
};

/**
 * Updates the status of an order.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} status - The new status.
 * @returns {Promise<object|undefined>} The updated order object or undefined if not found.
 */
export const updateOrderStatus = async (orderId, status) => {
    const [updatedOrder] = await db('orders').where({ id: orderId }).update({ status }).returning('*');
    return updatedOrder;
};

/**
 * Finds all support tickets.
 * @returns {Promise<Array>} An array of all support ticket objects.
 */
export const findAllSupportTickets = () => {
    return db('support_tickets').orderBy('created_at', 'desc');
};

/**
 * Finds a single support ticket by its ID.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<object|undefined>} The ticket object or undefined.
 */
export const findSupportTicketById = (ticketId) => {
    return db('support_tickets').where({ id: ticketId }).first();
};

/**
 * Creates a reply for a support ticket.
 * @param {object} replyData - The data for the reply.
 * @returns {Promise<object>} The newly created reply object.
 */
export const createSupportTicketReply = async (replyData) => {
    const [newReply] = await db('support_ticket_replies').insert(replyData).returning('*');
    return newReply;
};

/**
 * Updates the status of a support ticket.
 * @param {number} ticketId - The ID of the ticket to update.
 * @param {string} status - The new status.
 * @returns {Promise<number>} The number of updated rows.
 */
export const updateSupportTicketStatus = (ticketId, status) => {
    return db('support_tickets').where({ id: ticketId }).update({ status });
};
