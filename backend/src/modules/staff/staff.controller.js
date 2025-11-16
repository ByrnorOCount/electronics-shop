import httpStatus from 'http-status';
import { createNotification } from '../notifications/notification.service.js';
import * as Staff from './staff.model.js';
import ApiError from '../../core/utils/ApiError.js';
import ApiResponse from '../../core/utils/ApiResponse.js';

/**
 * Create a new product.
 * @route POST /api/staff/products
 * @access Staff
 */
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Staff.createProduct(req.body);
    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, newProduct, 'Product created successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product.
 * @route PUT /api/staff/products/:id
 * @access Staff
 */
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Staff.updateProduct(id, req.body);
    if (!updatedProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
    }
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedProduct, 'Product updated successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product.
 * @route DELETE /api/staff/products/:id
 * @access Staff
 */
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedCount = await Staff.deleteProduct(id);
    if (deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products (for staff view).
 * @route GET /api/staff/products
 * @access Staff
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Staff.findAllProducts();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, products));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders from all users.
 * @route GET /api/staff/orders
 * @access Staff
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Staff.findAllOrders();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, orders));
  } catch (error) {
    next(error);
  }
};

/**
 * Update the status of an order.
 * @route PUT /api/staff/orders/:id
 * @access Staff
 */
export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Staff.updateOrderStatus(id, status);
    if (!updatedOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found.');
    }
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedOrder, 'Order status updated.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all support tickets from all users.
 * @route GET /api/staff/support-tickets
 * @access Staff
 */
export const getAllSupportTickets = async (req, res, next) => {
  try {
    const tickets = await Staff.findAllSupportTickets();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, tickets));
  } catch (error) {
    next(error);
  }
};

/**
 * Reply to a support ticket.
 * @route POST /api/staff/support-tickets/:ticketId/reply
 * @access Staff
 */
export const replyToTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  const { message } = req.body;
  const staffId = req.user.id;

  try {
    const ticket = await Staff.findSupportTicketById(ticketId);
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Support ticket not found.');
    }

    const newReply = await Staff.createSupportTicketReply({ ticket_id: ticketId, user_id: staffId, message });

    // Optionally, update the ticket status to 'in_progress' or 'answered'
    await Staff.updateSupportTicketStatus(ticketId, 'in_progress');

    // Notify the user that their ticket has a new reply
    await createNotification(ticket.user_id, `Your support ticket #${ticketId} has a new reply from staff.`);

    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, newReply, 'Reply posted successfully.'));
  } catch (error) {
    next(error);
  }
};
