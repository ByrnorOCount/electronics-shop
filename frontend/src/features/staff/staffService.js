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

/**
 * Creates a new product.
 * @param {object} productData - The data for the new product.
 * @returns {Promise<object>} The newly created product object.
 */
const createProduct = async (productData) => {
  const response = await api.post("/staff/products", productData);
  return response.data.data;
};

/**
 * Updates an existing product.
 * @param {string | number} productId - The ID of the product to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object>} The updated product object.
 */
const updateProduct = async (productId, updateData) => {
  const response = await api.put(`/staff/products/${productId}`, updateData);
  return response.data.data;
};

/**
 * Deletes a product by its ID.
 * @param {string | number} productId - The ID of the product to delete.
 * @returns {Promise<object>} A promise that resolves when the product is deleted.
 */
const deleteProduct = async (productId) => {
  // DELETE typically returns a 204 No Content, so we don't expect a body
  await api.delete(`/staff/products/${productId}`);
  return { id: productId }; // Return the ID for frontend state updates
};

/**
 * Uploads a product image file.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<{imageUrl: string}>} The path to the uploaded image.
 */
const uploadProductImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/staff/products/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

const staffService = {
  getAllSupportTickets,
  updateTicketStatus,
  replyToTicket,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};

export default staffService;
