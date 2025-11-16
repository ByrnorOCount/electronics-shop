import db from '../../config/db.js';

/**
 * Updates a user's record with an OTP hash and expiration.
 * @param {number} userId - The ID of the user.
 * @param {string} otpHash - The hashed OTP.
 * @returns {Promise<void>}
 */
export const saveOtpForUser = (userId, otpHash) => {
    return db('users')
        .where({ id: userId })
        .update({
            otp_hash: otpHash,
            otp_expires: db.raw("NOW() + INTERVAL '10 minutes'"),
        });
};

/**
 * Finds a user by their ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|undefined>} The user object or undefined.
 */
export const findUserById = (userId) => {
    return db('users').where({ id: userId }).first();
};

/**
 * Finds all cart items for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of cart items.
 */
export const findCartItemsByUserId = (userId) => {
    return db('cart_items').where({ user_id: userId });
};

/**
 * Finds a single order by its ID, including its items.
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<object|undefined>} An order object with its items, or undefined.
 */
export const findOrderByIdWithItems = async (orderId) => {
    const order = await db('orders').where({ id: orderId }).first();

    if (!order) {
        return undefined;
    }

    const items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where('order_items.order_id', orderId)
        .select('order_items.*', 'products.name', 'products.image_url');

    return {
        ...order,
        items,
    };
};
/**
 * Finds all orders for a user, including their items.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of order objects with their items.
 */
export const findOrdersByUserIdWithItems = async (userId) => {
    const orders = await db('orders').where({ user_id: userId }).orderBy('created_at', 'desc');

    if (orders.length === 0) {
        return [];
    }

    const orderIds = orders.map((o) => o.id);
    const items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .whereIn('order_items.order_id', orderIds)
        .select('order_items.*', 'products.name', 'products.image_url');

    return orders.map((order) => ({
        ...order,
        items: items.filter((item) => item.order_id === order.id),
    }));
};

/**
 * Clears the OTP fields for a user after successful use.
 * @param {number} userId - The ID of the user.
 */
export const clearUserOtp = (userId) => {
    return db('users').where({ id: userId }).update({ otp_hash: null, otp_expires: null });
};
