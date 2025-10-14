import crypto from 'crypto';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { sendOrderConfirmationEmail, sendOtpEmail } from '../services/emailService.js';
import { createNotification } from '../services/notificationService.js';

/**
 * Generate and send an OTP for checkout verification.
 * @route POST /api/orders/generate-otp
 * @access Private
 */
export const generateCheckoutOtp = async (req, res) => {
  const userId = req.user.id;

  try {
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Set OTP and its expiration (10 minutes) on the user record
    await db('users')
      .where({ id: userId })
      .update({
        otp_hash: otpHash,
        otp_expires: db.raw("NOW() + INTERVAL '10 minutes'"),
      });

    // Send the OTP via email
    await sendOtpEmail(req.user, otp);

    res.status(200).json({ message: 'An OTP has been sent to your email.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Server error while generating OTP.' });
  }
};

/**
 * Create a new order from the user's cart.
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  const { shippingAddress, otp } = req.body;
  const userId = req.user.id;

  if (!shippingAddress || !otp) {
    return res.status(400).json({ message: 'Shipping address and OTP are required.' });
  }

  // Find user and check OTP
  const user = await db('users').where({ id: userId }).first();
  const isOtpValid = user.otp_hash && (await bcrypt.compare(otp, user.otp_hash));
  const isOtpExpired = new Date() > new Date(user.otp_expires);

  if (!isOtpValid || isOtpExpired) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  try {
    const cartItems = await db('cart_items')
      .join('products', 'cart_items.product_id', 'products.id')
      .where('cart_items.user_id', userId)
      .select('products.id as productId', 'products.price', 'cart_items.quantity');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot create order with an empty cart.' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = await db.transaction(async (trx) => {
      // 1. Create the order
      const [order] = await trx('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: 'Pending',
        })
        .returning('*');

      // 2. Prepare order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price, // Price at the time of purchase
      }));

      // 3. Insert order items
      await trx('order_items').insert(orderItems);

      // 4. Clear the user's cart
      await trx('cart_items').where('user_id', userId).del();

      // 5. Create a notification for the user
      await createNotification(userId, `Your order #${order.id} has been placed successfully.`, trx);

      // 6. Clear the OTP from the user record
      await trx('users').where({ id: userId }).update({ otp_hash: null, otp_expires: null });

      return order;
    });

    // Send confirmation email (fire and forget, don't block the response)
    sendOrderConfirmationEmail(req.user, newOrder);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order.' });
  }
};

/**
 * Get all orders for the logged-in user.
 * @route GET /api/orders
 * @access Private
 */
export const getOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    // Get all orders for the user
    const orders = await db('orders').where({ user_id: userId }).orderBy('created_at', 'desc');

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    // Get all items for those orders in a single query
    const orderIds = orders.map((o) => o.id);
    const items = await db('order_items')
      .join('products', 'order_items.product_id', 'products.id')
      .whereIn('order_items.order_id', orderIds)
      .select('order_items.*', 'products.name');

    // Map items to their respective orders
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};