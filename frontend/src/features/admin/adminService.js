import api from "../../api/axios";

/**
 * Fetches detailed analytics data from the server.
 * @param {object} params - Query parameters like startDate and endDate.
 * @returns {Promise<object>} A promise that resolves to the analytics data.
 */
const getAnalytics = async (params) => {
  const response = await api.get("/admin/analytics", { params });
  return response.data.data;
};

/**
 * Fetches system logs from the server.
 * @param {object} params - Query parameters for filtering logs.
 * @returns {Promise<object>} A promise that resolves to the system logs.
 */
const getLogs = async (params) => {
  const response = await api.get("/admin/logs", { params });
  return response.data.data;
};

/**
 * Fetches dashboard metrics for the site overview.
 * @returns {Promise<object>} A promise that resolves to the dashboard metrics.
 */
const getDashboardMetrics = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data.data;
};

/**
 * Fetches all categories.
 * @returns {Promise<Array>} A promise that resolves to an array of categories.
 */
const getAllCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data.data;
};

/**
 * Creates a new category.
 * @param {object} categoryData - The data for the new category (name, description).
 * @returns {Promise<object>} The newly created category.
 */
const createCategory = async (categoryData) => {
  const response = await api.post("/admin/categories", categoryData);
  return response.data.data;
};

/**
 * Updates an existing category.
 * @param {string|number} categoryId - The ID of the category to update.
 * @param {object} updateData - The fields to update.
 * @returns {Promise<object>} The updated category.
 */
const updateCategory = async (categoryId, updateData) => {
  const response = await api.put(`/admin/categories/${categoryId}`, updateData);
  return response.data.data;
};

/**
 * Deletes a category by its ID.
 * @param {string|number} categoryId - The ID of the category to delete.
 * @returns {Promise<{id: string|number}>} A promise that resolves with the deleted category's ID.
 */
const deleteCategory = async (categoryId) => {
  await api.delete(`/admin/categories/${categoryId}`);
  return { id: categoryId }; // Return ID for frontend state updates
};

/**
 * Fetches all users.
 * @param {object} params - Optional query parameters for filtering/sorting.
 * @returns {Promise<Array>} A promise that resolves to an array of users.
 */
const getAllUsers = async (params) => {
  const response = await api.get("/admin/users", { params });
  return response.data.data;
};

/**
 * Updates a user's role.
 * @param {string|number} userId - The ID of the user to update.
 * @param {{role: string}} roleData - The new role for the user.
 * @returns {Promise<object>} The updated user object.
 */
const updateUserRole = async (userId, roleData) => {
  const response = await api.put(`/admin/users/${userId}`, roleData);
  return response.data.data;
};

/**
 * Deletes a user by their ID.
 * @param {string|number} userId - The ID of the user to delete.
 * @returns {Promise<{id: string|number}>} A promise that resolves with the deleted user's ID.
 */
const deleteUser = async (userId) => {
  await api.delete(`/admin/users/${userId}`);
  return { id: userId }; // Return ID for frontend state updates
};

const adminService = {
  getAnalytics,
  getLogs,
  getDashboardMetrics,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllUsers,
  updateUserRole,
  deleteUser,
};

export default adminService;
