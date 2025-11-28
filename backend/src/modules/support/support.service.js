import * as supportModel from "./support.model.js";
import httpStatus from "http-status";
import ApiError from "../../core/utils/ApiError.js";

/**
 * Submit a new support ticket
 * @param {number|string} userId
 * @param {string} subject
 * @param {string} message
 * @returns {Promise<object>}
 */
export const submitTicket = async (userId, subject, message) => {
  if (!subject || !message) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Subject and message are required."
    );
  }

  const newTicket = await supportModel.create({
    user_id: userId,
    subject,
    message,
    status: "open",
  });

  return newTicket;
};

/**
 * Get tickets for a user
 * @param {number|string} userId - The ID of the user
 * @param {object} filter - Knex filter
 * @param {object} options - Query options
 * @returns {Promise<Array>}
 */
export const getUserTickets = async (userId, filter, options) => {
  // Add pagination/sorting logic here if needed in the future
  return supportModel.findByUserId(userId);
};

/**
 * Get a ticket by id for a user
 * @param {number|string} ticketId
 * @param {number|string} userId
 * @returns {Promise<object>}
 */
export const getTicketById = async (ticketId, user) => {
  let ticket;
  // Staff can get any ticket, users can only get their own.
  if (user.role === "staff" || user.role === "admin") {
    ticket = await supportModel.findById(ticketId);
  } else {
    ticket = await supportModel.findByIdAndUserId(ticketId, user.id);
  }

  if (!ticket) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Ticket not found or you do not have permission to view it."
    );
  }

  const replies = await supportModel.findRepliesByTicketId(ticketId);
  const author = await supportModel.findTicketAuthor(ticketId);

  // The original message is also part of the thread
  const initialMessage = {
    id: `ticket-${ticket.id}`,
    ticket_id: ticket.id,
    user_id: ticket.user_id,
    message: ticket.message,
    created_at: ticket.created_at,
    author_name: author.author_name,
    author_role: author.author_role,
  };

  return { ticket, replies: [initialMessage, ...replies] };
};

/**
 * Adds a reply to a support ticket.
 * If the ticket is closed, it will be re-opened.
 * @param {number|string} ticketId
 * @param {object} user
 * @param {string} message
 * @returns {Promise<object>}
 */
export const addTicketReply = async (ticketId, user, message) => {
  let ticket;
  // Staff can reply to any ticket, users can only reply to their own.
  if (user.role === "staff" || user.role === "admin") {
    ticket = await supportModel.findById(ticketId);
  } else {
    ticket = await supportModel.findByIdAndUserId(ticketId, user.id);
  }

  if (!ticket) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Ticket not found or you do not have permission to reply to it."
    );
  }

  // If ticket is closed, re-open it upon user reply.
  if (ticket.status === "closed") {
    await supportModel.update(ticketId, { status: "open" });
  }

  return supportModel.createReply({
    ticket_id: ticketId,
    user_id: user.id,
    message,
  });
};

/**
 * Updates the status of a support ticket.
 * @param {number|string} ticketId
 * @param {object} user
 * @param {string} newStatus
 * @returns {Promise<object>}
 */
export const updateTicketStatus = async (ticketId, user, newStatus) => {
  const ticket = await supportModel.findById(ticketId);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, "Ticket not found.");
  }

  const isOwner = ticket.user_id === user.id;
  const isStaff = user.role === "staff" || user.role === "admin";

  // Only the owner or staff can update the status.
  if (!isOwner && !isStaff) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to update this ticket."
    );
  }

  // A regular user can only close the ticket.
  if (!isStaff && newStatus !== "closed") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only close the ticket."
    );
  }

  const [updatedTicket] = await supportModel.update(ticketId, {
    status: newStatus,
  });

  return updatedTicket;
};

/**
 * Returns a list of FAQs (static for now)
 */
export const getFaqs = () => {
  return [
    {
      id: 1,
      question: "What is your return policy?",
      answer:
        "You can return any item within 30 days of purchase for a full refund, provided it is in its original condition.",
    },
    {
      id: 2,
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. Expedited shipping options are available at checkout.",
    },
    {
      id: 3,
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within the country. International shipping will be available in the future.",
    },
  ];
};
