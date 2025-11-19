import * as supportService from "./support.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";
import ApiError from "../../core/utils/ApiError.js";

/**
 * @summary Submit a new support ticket
 * @route POST /api/support
 * @access Private
 */
export const submitTicket = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const newTicket = await supportService.submitTicket(
      req.user.id,
      subject,
      message
    );
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          newTicket,
          "Ticket submitted successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get all support tickets for the logged-in user
 * @route GET /api/support
 * @access Private
 */
export const getUserTickets = async (req, res, next) => {
  try {
    // Pass query params for potential future filtering/pagination
    const tickets = await supportService.getUserTickets(req.user.id, req.query);
    if (!tickets) {
      return next(
        new ApiError(httpStatus.NOT_FOUND, "No tickets found for this user.")
      );
    }
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          tickets,
          "Tickets retrieved successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Get a single support ticket by ID
 * @route GET /api/support/:ticketId
 * @access Private
 */
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await supportService.getTicketById(
      req.params.ticketId,
      req.user,
      req.query
    );
    if (!ticket) {
      return next(
        new ApiError(
          httpStatus.NOT_FOUND,
          "Ticket not found or you do not have permission to view it."
        )
      );
    }
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, ticket, "Ticket retrieved successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Add a reply to a support ticket
 * @route POST /api/support/:ticketId/reply
 * @access Private
 */
export const addTicketReply = async (req, res, next) => {
  try {
    const { message } = req.body;
    const newReply = await supportService.addTicketReply(
      req.params.ticketId,
      req.user,
      message
    );
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          newReply,
          "Reply added successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @summary Update the status of a support ticket
 * @route PUT /api/support/:ticketId/status
 * @access Private
 */
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedTicket = await supportService.updateTicketStatus(
      req.params.ticketId,
      req.user,
      status
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

/**
 * @summary Get all Frequently Asked Questions
 * @route GET /api/faq
 * @access Public
 */
export const getFaqs = async (req, res, next) => {
  try {
    const faqs = await supportService.getFaqs();
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, faqs, "FAQs retrieved successfully.")
      );
  } catch (error) {
    next(error);
  }
};
