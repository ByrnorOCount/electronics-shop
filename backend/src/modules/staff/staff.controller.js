import * as staffService from './staff.service.js';
import httpStatus from 'http-status';
import ApiResponse from '../../core/utils/ApiResponse.js';

/**
 * @summary Create a new product
 * @route POST /api/staff/products
 * @access Staff
 */
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await staffService.createProduct(req.body);
    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, newProduct, 'Product created successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Update an existing product
 * @route PUT /api/staff/products/:id
 * @access Staff
 */
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await staffService.updateProduct(req.params.id, req.body);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedProduct, 'Product updated successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Delete a product
 * @route DELETE /api/staff/products/:id
 * @access Staff
 */
export const deleteProduct = async (req, res, next) => {
  try {
    await staffService.deleteProduct(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get all products
 * @route GET /api/staff/products
 * @access Staff
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await staffService.getAllProducts();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, products, 'Products retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get all orders
 * @route GET /api/staff/orders
 * @access Staff
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await staffService.getAllOrders();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, orders, 'Orders retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Update order status
 * @route PUT /api/staff/orders/:id
 * @access Staff
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await staffService.updateOrderStatus(req.params.id, req.body.status);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, updatedOrder, 'Order status updated successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get all support tickets
 * @route GET /api/staff/support-tickets
 * @access Staff
 */
export const getAllSupportTickets = async (req, res, next) => {
  try {
    const tickets = await staffService.getAllSupportTickets();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, tickets, 'Support tickets retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Reply to support ticket
 * @route POST /api/staff/support-tickets/:ticketId/reply
 * @access Staff
 */
export const replyToTicket = async (req, res, next) => {
  try {
    const reply = await staffService.replyToTicket(req.params.ticketId, req.body.message, req.user.id);
    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, reply, 'Reply posted successfully.'));
  } catch (error) {
    next(error);
  }
};
