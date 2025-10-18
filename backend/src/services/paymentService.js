import db from '../config/db.js';
import { createNotification } from './notificationService.js';
import { sendOrderConfirmationEmail } from './emailService.js';

/**
 * Creates an order in the database from a user's cart.
 * This function encapsulates the transaction logic for creating an order,
 * adding order items, clearing the cart, and sending notifications.
 *
 * @param {number} userId - The ID of the user placing the order.
 * @param {string} shippingAddress - The shipping address for the order.
 * @param {string} paymentMethod - The payment method used (e.g., 'cod', 'stripe', 'vnpay').
 * @param {object} paymentDetails - Additional details from the payment gateway (e.g., transaction ID).
 * @returns {Promise<object>} The newly created order object.
 */
export const createOrderFromCart = async (userId, shippingAddress, paymentMethod, paymentDetails = {}) => {
  const user = await db('users').where({ id: userId }).first();
  if (!user) throw new Error('User not found');

  const cartItems = await db('cart_items')
    .join('products', 'cart_items.product_id', 'products.id')
    .where('cart_items.user_id', userId)
    .select('products.id as productId', 'products.price', 'cart_items.quantity');

  if (cartItems.length === 0) {
    throw new Error('Cannot create order with an empty cart.');
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = await db.transaction(async (trx) => {
    const [order] = await trx('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'Pending',
      })
      .returning('*');

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await trx('order_items').insert(orderItems);
    await trx('cart_items').where('user_id', userId).del();
    await createNotification(userId, `Your order #${order.id} has been placed successfully.`, trx);

    return order;
  });

  sendOrderConfirmationEmail(user, newOrder);
  return newOrder;
};
