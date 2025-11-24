import api from "../../api/axios";

/**
 * Fetches all support tickets for staff.
 * @param {object} query - Optional query params for filtering/sorting.
 * @returns {Promise<Array>} A list of all support tickets.
 */
const getAllSupportTickets = async (query = {}) => {
  const response = await api.get("/staff/support-tickets", { params: query });
  return response.data.data;
};

/**
 * Updates the status of a support ticket by a staff member.
 * @param {string | number} ticketId - The ID of the ticket.
 * @param {{ status: string }} statusData - The new status.
 * @returns {Promise<object>} The updated ticket.
 */
const updateTicketStatus = async (ticketId, statusData) => {
  const response = await api.put(
    `/staff/support-tickets/${ticketId}/status`,
    statusData
  );
  return response.data.data;
};

/**
 * Adds a reply to a support ticket by a staff member.
 * @param {string | number} ticketId - The ID of the ticket.
 * @param {{ message: string }} replyData - The reply message.
 * @returns {Promise<object>} The newly created reply.
 */
const replyToTicket = async (ticketId, replyData) => {
  const response = await api.post(
    `/staff/support-tickets/${ticketId}/reply`,
    replyData
  );
  return response.data.data;
};

/**
 * Fetches all orders for staff.
 * @param {object} query - Optional query params for filtering/sorting.
 * @returns {Promise<Array>} A list of all orders.
 */
const getAllOrders = async (query = {}) => {
  const response = await api.get("/staff/orders", { params: query });
  return response.data.data;
};

/**
 * Updates the status of an order by a staff member.
 * @param {string | number} orderId - The ID of the order.
 * @param {{ status: string }} statusData - The new status.
 * @returns {Promise<object>} The updated order.
 */
const updateOrderStatus = async (orderId, statusData) => {
  const response = await api.put(`/staff/orders/${orderId}`, statusData);
  return response.data.data;
};

/**
 * Fetches all products for staff.
 * @param {object} query - Optional query params for filtering/sorting.
 * @returns {Promise<Array>} A list of all products.
 */
const getAllProducts = async (query = {}) => {
  const response = await api.get("/staff/products", { params: query });
  return response.data.data;
};

const staffService = {
  getAllSupportTickets,
  updateTicketStatus,
  replyToTicket,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
};

export default staffService;
