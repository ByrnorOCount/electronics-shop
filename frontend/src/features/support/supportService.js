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

const supportService = {
  submitTicket,
  getUserTickets,
  getFaqs,
};

export default supportService;
