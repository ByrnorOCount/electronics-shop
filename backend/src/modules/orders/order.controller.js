import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import db from '../../config/db.js';
import { sendOtpEmail } from '../../core/integrations/email.service.js';
import * as Order from './order.model.js';
import { createOrderFromCart } from '../../core/integrations/payment.service.js';
import { VNPay } from 'vnpay';

// TODO: Uninstall vnpay

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMNCODE,
  secureSecret: process.env.VNPAY_HASHSECRET,
  vnpayHost: process.env.VNPAY_URL, // e.g., 'https://sandbox.vnpayment.vn'
  testMode: process.env.NODE_ENV !== 'production',
});

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
    await Order.saveOtpForUser(userId, otpHash);
    // Send the OTP via email
    await sendOtpEmail(req.user, otp);

    res.status(200).json({ message: 'An OTP has been sent to your email.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Server error while generating OTP.' });
  }
};

/**
 * Creates a Stripe checkout session.
 * @param {Array} cartItems - The items in the user's cart.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object>} An object containing the session URL.
 */
const createStripeSession = async (cartItems, userId) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems.map(item => ({
      price_data: {
        currency: 'usd', // Or your desired currency
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.VNPAY_RETURN_URL}?success=true`,
    cancel_url: `${process.env.VNPAY_RETURN_URL}?success=false`,
    metadata: {
      userId,
      // In a real app, you'd collect the shipping address on the frontend
      // and pass it here to be used in the webhook.
    },
  });
  return { url: session.url };
};

/**
 * Creates a VNPay payment URL.
 * @param {Array} cartItems - The items in the user's cart.
 * @param {import('express').Request} req - The Express request object.
 * @returns {Promise<object>} An object containing the payment URL.
 */
const createVNPaySession = async (cartItems, req) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const orderId = `${Date.now()}`; // Temporary ID for tracking

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: totalAmount * 100, // VNPay requires amount in pennies
    vnp_IpAddr: ipAddr,
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Payment for order at Electronics Shop',
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
  });

  return { url: paymentUrl };
};

// Strategy map for payment providers
const paymentStrategies = {
  stripe: createStripeSession,
  vnpay: createVNPaySession,
};

/**
 * Create a payment session for online payments (Stripe, VNPay).
 * @route POST /api/orders/create-payment-session
 * @access Private
 */
export const createPaymentSession = async (req, res) => {
  const { paymentMethod } = req.body; // 'stripe' or 'vnpay'
  const userId = req.user.id;

  try {
    const cartItems = await db('cart_items')
      .join('products', 'cart_items.product_id', 'products.id')
      .where('cart_items.user_id', userId)
      .select('products.id as productId', 'products.name', 'products.price', 'cart_items.quantity');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot create payment with an empty cart.' });
    }

    // Look up the correct payment strategy function from the map
    const paymentHandler = paymentStrategies[paymentMethod];

    if (!paymentHandler) {
      return res.status(400).json({ message: 'Invalid online payment method specified.' });
    }

    // Execute the chosen strategy
    const paymentData = await paymentHandler(cartItems, req);

    res.status(200).json({ ...paymentData, paymentMethod });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ message: 'Server error while creating payment session.' });
  }
};

/**
 * Create a new order from the user's cart.
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, otp } = req.body;
  const userId = req.user.id;

  if (!shippingAddress || !paymentMethod || !otp) {
    return res.status(400).json({ message: 'Shipping address, payment method, and OTP are required.' });
  }

  // Find user and check OTP
  const user = await Order.findUserById(userId);
  const isOtpValid = user.otp_hash && (await bcrypt.compare(otp, user.otp_hash));
  const isOtpExpired = new Date() > new Date(user.otp_expires);

  if (!isOtpValid || isOtpExpired) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }
  const cartItems = await Order.findCartItemsByUserId(userId);
  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
  }

  // This endpoint is now only for Cash on Delivery (COD)
  if (paymentMethod === 'online') {
    return res.status(400).json({ message: 'For online payments, please use the /api/orders/create-payment-session endpoint.' });
  }

  // The rest of this function handles COD orders

  try {
    // Use the centralized order creation service
    const newOrder = await createOrderFromCart(userId, shippingAddress, 'cod');

    // After creating the order, fetch it again with its items to return to the frontend.
    const finalOrder = await db('orders')
      .where('orders.id', newOrder.id)
      .first();

    const orderItems = await db('order_items')
      .join('products', 'order_items.product_id', 'products.id')
      .where('order_items.order_id', newOrder.id)
      .select('order_items.*', 'products.name', 'products.image_url');

    finalOrder.items = orderItems;

    // Clear the OTP from the user record after successful order creation
    await Order.clearUserOtp(userId);

    res.status(201).json({ message: 'Order created successfully', order: finalOrder });
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
    const ordersWithItems = await Order.findOrdersByUserIdWithItems(userId);
    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
};

/**
 * Handles incoming webhooks from payment providers (Stripe, VNPay).
 * @route POST /api/orders/webhook
 * @access Public (verified by signature/hash)
 */
export const handlePaymentWebhook = async (req, res) => {
  // --- Stripe Webhook Handling ---
  const stripeSignature = req.headers['stripe-signature'];
  if (stripeSignature) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, stripeSignature, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId } = session.metadata;
      // NOTE: In a real app, you'd get the shipping address from session.shipping_details
      // or pass it in metadata if you collected it before creating the session.
      const shippingAddress = session.shipping_details?.address ?
        Object.values(session.shipping_details.address).join(', ') :
        'Address from Stripe';

      try {
        await createOrderFromCart(Number(userId), shippingAddress, 'stripe', {
          transactionId: session.payment_intent,
        });
        console.log(`✅ Order created for user ${userId} via Stripe.`);
      } catch (error) {
        console.error('Failed to create order from Stripe webhook:', error);
        // You might want to send an alert here
        return res.status(500).json({ message: 'Error processing order.' });
      }
    }

    res.status(200).json({ received: true });
    return;
  }

  // --- VNPay Webhook Handling (IPN) ---
  // TODO: Implement VNPay IPN (Instant Payment Notification) verification and handling.
  // This is similar to Stripe but uses a secure hash in the query parameters.

  res.status(400).json({ message: 'Unrecognized webhook source.' });
};