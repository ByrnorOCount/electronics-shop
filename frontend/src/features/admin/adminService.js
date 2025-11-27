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

const adminService = {
  getAnalytics,
  getLogs,
  getDashboardMetrics,
};

export default adminService;
