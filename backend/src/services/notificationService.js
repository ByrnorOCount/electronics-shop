import db from '../config/db.js';

/**
 * Creates a notification for a user.
 * @param {number} userId - The ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {object} [trx] - Optional Knex transaction object.
 */
export const createNotification = async (userId, message, trx) => {
  const query = db('notifications').insert({
    user_id: userId,
    message: message,
  });
  if (trx) query.transacting(trx);
  await query;
};
