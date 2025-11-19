import api from "../../api/axios";

/**
 * Submits a new support ticket.
 * @param {{ subject: string, message: string }} ticketData - The ticket data.
 * @returns {Promise<object>} The newly created ticket.
 */
const submitTicket = async (ticketData) => {
  const response = await api.post("/support", ticketData);
  return response.data.data;
};

/**
 * Fetches all support tickets for the current user.
 * @returns {Promise<Array>} A list of the user's tickets.
 */
const getUserTickets = async () => {
  const response = await api.get("/support");
  return response.data.data;
};

/**
 * Fetches all frequently asked questions.
 * @returns {Promise<Array>} A list of FAQs.
 */
const getFaqs = async () => {
  const response = await api.get("/support/faq");
  return response.data.data;
};

/**
 * Fetches a single support ticket by its ID, including its replies.
 * @param {string | number} ticketId - The ID of the ticket.
 * @returns {Promise<{ticket: object, replies: Array}>} The ticket and its replies.
 */
const getTicketById = async (ticketId) => {
  const response = await api.get(`/support/${ticketId}`);
  return response.data.data;
};

/**
 * Adds a reply to a specific support ticket.
 * @param {string | number} ticketId - The ID of the ticket.
 * @param {{ message: string }} replyData - The reply message.
 * @returns {Promise<object>} The newly created reply.
 */
const addTicketReply = async (ticketId, replyData) => {
  const response = await api.post(`/support/${ticketId}/reply`, replyData);
  return response.data.data;
};

/**
 * Updates the status of a support ticket.
 * @param {string | number} ticketId - The ID of the ticket.
 * @param {{ status: string }} statusData - The new status.
 * @returns {Promise<object>} The updated ticket.
 */
const updateTicketStatus = async (ticketId, statusData) => {
  const response = await api.put(`/support/${ticketId}/status`, statusData);
  return response.data.data;
};

const supportService = {
  submitTicket,
  getUserTickets,
  getFaqs,
  getTicketById,
  addTicketReply,
  updateTicketStatus,
};

export default supportService;
