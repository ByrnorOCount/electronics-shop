import * as supportModel from './support.model.js';
import httpStatus from 'http-status';
import ApiError from '../../core/utils/ApiError.js';

/**
 * Submit a new support ticket
 * @param {number|string} userId
 * @param {string} subject
 * @param {string} message
 * @returns {Promise<object>}
 */
export const submitTicket = async (userId, subject, message) => {
  if (!subject || !message) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Subject and message are required.');
  }

  const newTicket = await supportModel.create({
    user_id: userId,
    subject,
    message,
    status: 'open',
  });

  return newTicket;
};

/**
 * Get tickets for a user
 * @param {number|string} userId
 */
export const getUserTickets = async (userId) => {
  return supportModel.findByUserId(userId);
};

/**
 * Get a ticket by id for a user
 * @param {number|string} ticketId
 * @param {number|string} userId
 */
export const getTicketById = async (ticketId, userId) => {
  const ticket = await supportModel.findByIdAndUserId(ticketId, userId);
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found or you do not have permission to view it.');
  }
  return ticket;
};

/**
 * Returns a list of FAQs (static for now)
 */
export const getFaqs = () => {
  return [
    {
      id: 1,
      question: 'What is your return policy?',
      answer: 'You can return any item within 30 days of purchase for a full refund, provided it is in its original condition.',
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Expedited shipping options are available at checkout.',
    },
    {
      id: 3,
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the country. International shipping will be available in the future.',
    },
  ];
};
