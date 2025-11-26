import * as staffService from "./staff.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * @summary Create a new product
 * @route POST /api/staff/products
 * @access Staff
 */
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await staffService.createProduct(req.body);
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          newProduct,
          "Product created successfully."
        )
      );
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
    const updatedProduct = await staffService.updateProduct(
      req.params.id,
      req.body
    );
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedProduct,
          "Product updated successfully."
        )
      );
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
    const products = await staffService.getAllProducts(req.query);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          products,
          "All products retrieved successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Upload a product image
 * @route POST /api/staff/products/upload-image
 * @access Staff
 */
export const uploadProductImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new ApiResponse(
            httpStatus.BAD_REQUEST,
            null,
            "No image file provided."
          )
        );
    }
    // The file is saved by multer. We just need to return the path.
    // The path should be relative to the public folder for the frontend to use.
    const imageUrl = `/images/${req.file.filename}`;
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          { imageUrl },
          "Image uploaded successfully."
        )
      );
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
    const orders = await staffService.getAllOrders(req.query);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          orders,
          "All orders retrieved successfully."
        )
      );
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
    const updatedOrder = await staffService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedOrder,
          "Order status updated successfully."
        )
      );
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
    const tickets = await staffService.getAllSupportTickets(req.query);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          tickets,
          "All support tickets retrieved successfully."
        )
      );
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
    const reply = await staffService.replyToTicket(
      req.params.ticketId,
      req.body.message,
      req.user.id
    );
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(httpStatus.CREATED, reply, "Reply posted successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Update support ticket status
 * @route PUT /api/staff/support-tickets/:ticketId/status
 * @access Staff
 */
export const updateTicketStatus = async (req, res, next) => {
  try {
    const updatedTicket = await staffService.updateTicketStatus(
      req.params.ticketId,
      req.body.status
    );
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedTicket,
          "Ticket status updated successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};
