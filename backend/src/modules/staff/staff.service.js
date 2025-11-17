import * as staffModel from './staff.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';
import { createNotification } from '../notifications/notification.service.js';

/**
 * Create a new product
 * @param {object} productData
 * @returns {Promise<object>}
 */
export const createProduct = async (productData) => {
    return staffModel.createProduct(productData);
};

/**
 * Update an existing product
 * @param {number|string} productId
 * @param {object} updateData
 * @returns {Promise<object>}
 */
export const updateProduct = async (productId, updateData) => {
    const updated = await staffModel.updateProduct(productId, updateData);
    if (!updated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return updated;
};

/**
 * Delete a product
 * @param {number|string} productId
 * @returns {Promise<number>} deleted rows
 */
export const deleteProduct = async (productId) => {
    const deletedCount = await staffModel.deleteProduct(productId);
    if (deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return deletedCount;
};

/**
 * Get all products (staff view)
 */
export const getAllProducts = async () => {
    return staffModel.findAllProducts();
};

/**
 * Get all orders
 */
export const getAllOrders = async () => {
    return staffModel.findAllOrders();
};

/**
 * Update order status
 * @param {number|string} orderId
 * @param {string} status
 */
export const updateOrderStatus = async (orderId, status) => {
    const updated = await staffModel.updateOrderStatus(orderId, status);
    if (!updated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    return updated;
};

/**
 * Get all support tickets
 */
export const getAllSupportTickets = async () => {
    return staffModel.findAllSupportTickets();
};

/**
 * Reply to a support ticket
 * @param {number|string} ticketId
 * @param {string} message
 * @param {number|string} staffId
 */
export const replyToTicket = async (ticketId, message, staffId) => {
    const ticket = await staffModel.findSupportTicketById(ticketId);
    if (!ticket) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Support ticket not found');
    }

    const newReply = await staffModel.createSupportTicketReply({ ticket_id: ticketId, user_id: staffId, message });

    // Update ticket status and notify the user
    await staffModel.updateSupportTicketStatus(ticketId, 'in_progress');
    await createNotification(ticket.user_id, `Your support ticket #${ticketId} has a new reply from staff.`);

    return newReply;
};
