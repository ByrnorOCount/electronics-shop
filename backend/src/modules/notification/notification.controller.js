import * as Notification from './notification.model.js';

/**
 * Get all notifications for the logged-in user.
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
    try {
        const { limit } = req.query; // The model will handle parsing the limit
        const notifications = await Notification.findByUserId(req.user.id, limit);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error while fetching notifications.' });
    }
};

/**
 * Get the count of unread notifications for the logged-in user.
 * @route GET /api/notifications/unread-count
 * @access Private
 */
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countUnreadByUserId(req.user.id);
        // The result from knex is an object like { count: '5' }, so we parse it.
        res.status(200).json({ count: parseInt(count, 10) });
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        res.status(500).json({ message: 'Server error while fetching notification count.' });
    }
};

/**
 * Mark a single notification as read.
 * @route PUT /api/notifications/:id
 * @access Private
 */
export const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const notification = await Notification.updateAsRead(id, userId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or you do not have permission to view it.' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error while updating notification.' });
    }
};

/**
 * Mark all notifications as read for the current user.
 * @route POST /api/notifications/mark-all-read
 * @access Private
 */
export const markAllNotificationsAsRead = async (req, res) => {
    const userId = req.user.id;

    try {
        await Notification.updateAllAsRead(userId);
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Server error while updating notifications.' });
    }
};
