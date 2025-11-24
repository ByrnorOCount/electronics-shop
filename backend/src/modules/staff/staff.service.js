import * as staffModel from "./staff.model.js";
import httpStatus from "http-status";
import ApiError from "../../core/utils/ApiError.js";
import { createNotification } from "../notifications/notification.service.js";

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
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return deletedCount;
};

/**
 * Get all products (staff view)
 * @param {object} options - Query options for pagination, sorting, etc.
 */
export const getAllProducts = async (options) => {
  // Future: Add logic to handle pagination based on options.limit and options.page
  return staffModel.findAllProducts(options);
};

/**
 * Get all orders
 * @param {object} options - Query options for pagination, sorting, etc.
 */
export const getAllOrders = async (options) => {
  const orders = await staffModel.findAllOrders(options);
  // For each order, fetch its associated items
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await staffModel.findOrderItems(order.id);
      return { ...order, items };
    })
  );
  return ordersWithItems;
};

/**
 * Update order status
 * @param {number|string} orderId
 * @param {string} status
 * @returns {Promise<object>}
 */
export const updateOrderStatus = async (orderId, status) => {
  const updated = await staffModel.updateOrderStatus(orderId, status);
  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Notify the user about the order status update
  await createNotification(
    updated.user_id,
    `Your order #${orderId} has been updated to "${status}".`,
    `/orders/${orderId}`
  );
  return updated;
};

/**
 * Get all support tickets
 * @param {object} options - Query options for pagination, sorting, etc.
 */
export const getAllSupportTickets = async (options) => {
  return staffModel.findAllSupportTickets(options);
};

/**
 * Reply to a support ticket
 * @param {number|string} ticketId
 * @param {number|string} staffId
 * @param {string} message
 * @returns {Promise<object>}
 */
export const replyToTicket = async (ticketId, message, staffId) => {
  const ticket = await staffModel.findSupportTicketById(ticketId);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, "Support ticket not found");
  }

  const replyData = {
    ticket_id: ticketId,
    user_id: staffId,
    message,
  };

  const newReply = await staffModel.createSupportTicketReply(replyData);

  // Update ticket status and notify the user
  await staffModel.update(ticketId, { status: "in_progress" });

  await createNotification(
    ticket.user_id,
    `Your support ticket #${ticketId} has a new reply from staff.`,
    `/support/ticket/${ticketId}`
  );

  return newReply;
};

/**
 * Update support ticket status by staff
 * @param {number|string} ticketId
 * @param {string} status
 * @returns {Promise<object>}
 */
export const updateTicketStatus = async (ticketId, status) => {
  const ticket = await staffModel.findSupportTicketById(ticketId);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, "Support ticket not found");
  }

  const [updatedTicket] = await staffModel.update(ticketId, { status });

  // Notify the user that the status has changed
  await createNotification(
    ticket.user_id,
    `The status of your support ticket #${ticketId} has been updated to "${status}".`,
    `/support/ticket/${ticketId}`
  );

  return updatedTicket;
};
