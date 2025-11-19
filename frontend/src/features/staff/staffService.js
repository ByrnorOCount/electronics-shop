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

const staffService = { getAllSupportTickets, updateTicketStatus };

export default staffService;
