import db from '../config/db.js';

/**
 * Finds all notifications for a given user.
 * @param {number} userId - The ID of the user.
 * @param {number} [limit] - Optional limit for the number of notifications to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of notifications.
 */
export const findByUserId = (userId, limit) => {
    let query = db('notifications').where({ user_id: userId }).orderBy('created_at', 'desc');

    if (limit && !isNaN(parseInt(limit, 10))) {
        query = query.limit(parseInt(limit, 10));
    }

    return query;
};

/**
 * Marks a single notification as read.
 * @param {number} notificationId - The ID of the notification.
 * @param {number} userId - The ID of the user (for ownership verification).
 * @returns {Promise<object|undefined>} The updated notification object or undefined if not found.
 */
export const updateAsRead = async (notificationId, userId) => {
    const [notification] = await db('notifications')
        .where({ id: notificationId, user_id: userId })
        .update({ is_read: true })
        .returning('*');
    return notification;
};

/**
 * Marks all unread notifications for a user as read.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} The number of updated rows.
 */
export const updateAllAsRead = (userId) => {
    return db('notifications')
        .where({ user_id: userId, is_read: false })
        .update({ is_read: true });
};
