import api from '../../api/axios';

/**
 * Fetches all notifications for the logged-in user.
 * @returns {Promise<Array>} A promise that resolves to an array of notification objects.
 */
const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

/**
 * Fetches the count of unread notifications.
 * @returns {Promise<{count: number}>} A promise that resolves to an object with the count.
 */
const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

/**
 * Marks a single notification as read.
 * @param {number} id - The ID of the notification to mark as read.
 * @returns {Promise<object>} A promise that resolves to the updated notification object.
 */
const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}`);
  return response.data;
};

/**
 * Marks all of the user's notifications as read.
 * @returns {Promise<object>} A promise that resolves to a success message.
 */
const markAllAsRead = async () => {
  const response = await api.post('/notifications/mark-all-read');
  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};

export default notificationService;