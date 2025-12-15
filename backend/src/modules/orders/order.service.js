import crypto from "crypto";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import Stripe from "stripe";
import * as orderModel from "./order.model.js";
import * as productModel from "../products/product.model.js";
import * as cartModel from "../cart/cart.model.js";
import {
  sendOrderConfirmationEmail,
  sendOtpEmail,
} from "../../core/integrations/email.service.js";
import ApiError from "../../core/utils/ApiError.js";
import env from "../../config/env.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/**
 * Generate and send an OTP for checkout verification.
 * @param {object} user - The authenticated user object.
 */
export const generateAndSendOtp = async (user) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  await orderModel.saveOtpForUser(user.id, otpHash);
  await sendOtpEmail(user, otp);
};

/**
 * Creates a Stripe checkout session.
 * @param {Array} cartItems - The items in the user's cart.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object>} An object containing the session URL.
 */
const createStripeSession = async (cartItems, userId, shippingAddress) => {
  // --- Preliminary Stock Check ---
  // This provides a better UX by failing early if something is out of stock.
  // The real atomic check happens in the webhook after payment.
  const productIds = cartItems.map((item) => item.product_id);
  const products = await productModel.find({ id: productIds });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of cartItems) {
    const product = productMap.get(item.product_id);
    if (!product || product.stock < item.quantity) {
      logger.warn("Preliminary stock check failed for Stripe session.", {
        productId: item.product_id,
        requested: item.quantity,
      });
      throw new ApiError(
        httpStatus.CONFLICT,
        `Sorry, '${item.name}' is out of stock or has insufficient quantity.`
      );
    }
  }
  // --- End of Preliminary Stock Check ---

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/checkout`,
    metadata: { userId, shippingAddress }, // Add shippingAddress to metadata
  });
  return { url: session.url };
};

const paymentStrategies = {
  stripe: createStripeSession,
};

/**
 * Create a payment session for online payments (e.g., Stripe).
 * @param {string} paymentMethod - 'stripe'.
 * @param {number} userId
 * @param {string} ipAddr
 * @returns {Promise<object>}
 */
export const createOnlinePaymentSession = async (
  paymentMethod,
  userId,
  shippingAddress
) => {
  const cartItems = await cartModel.findByUserId(userId);
  if (cartItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create payment with an empty cart."
    );
  }

  const paymentHandler = paymentStrategies[paymentMethod];
  if (!paymentHandler) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid online payment method specified."
    );
  }

  const paymentData = await paymentHandler(cartItems, userId, shippingAddress);
  return { ...paymentData, paymentMethod };
};

/**
 * Create a new Cash on Delivery (COD) order.
 * @param {number} userId
 * @param {string} shippingAddress
 * @param {string} otp
 * @returns {Promise<object>}
 */
export const createCodOrder = async (userId, shippingAddress, otp) => {
  const user = await orderModel.findUserById(userId);
  const isOtpValid =
    user.otp_hash && (await bcrypt.compare(otp, user.otp_hash));
  const isOtpExpired = new Date() > new Date(user.otp_expires);

  if (!isOtpValid || isOtpExpired) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP.");
  }

  // Delegate order creation and transaction handling to the model layer.
  const newOrder = await orderModel.createOrderFromCartInTransaction(
    userId,
    shippingAddress,
    "cod"
  );

  await orderModel.clearUserOtp(userId);

  const finalOrder = await orderModel.findOrderByIdWithItems(newOrder.id);
  return finalOrder;
};

/**
 * Creates an order within a database transaction, ensuring stock is sufficient
 * and decrementing it atomically.
 * @param {number} userId
 * @param {string} shippingAddress
 * @param {string} paymentMethod
 * @param {object} [paymentDetails={}]
 * @returns {Promise<object>} The newly created order.
 */
export const createOrderInTransaction = (
  userId,
  shippingAddress,
  paymentMethod,
  paymentDetails = {}
) => {
  // Simply delegate to the model, which now handles the transaction.
  return orderModel.createOrderFromCartInTransaction(
    userId,
    shippingAddress,
    paymentMethod,
    paymentDetails
  );
};

/**
 * Get all orders for a user.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getOrdersForUser = (userId) => {
  return orderModel.findOrdersByUserIdWithItems(userId);
};

/**
 * Fetches a newly created order and sends a confirmation email.
 * This is typically called after a successful payment webhook.
 * @param {number} orderId - The ID of the order to confirm.
 */
export const sendOrderConfirmationEmailForOrder = async (orderId) => {
  const orderWithDetails = await orderModel.findOrderByIdWithItems(orderId);
  if (!orderWithDetails) {
    throw new Error(
      `Order with ID ${orderId} not found for email confirmation.`
    );
  }

  const user = await orderModel.findUserById(orderWithDetails.user_id);
  if (!user) {
    throw new Error(`User for order ID ${orderId} not found.`);
  }

  await sendOrderConfirmationEmail(user, orderWithDetails);
};

/**
 * Finds an order by its Stripe session ID for a specific user.
 * @param {string} sessionId The Stripe checkout session ID.
 * @param {number} userId The ID of the user who owns the order.
 * @returns {Promise<object|null>} The order object or null if not found.
 */
export const getOrderBySessionId = async (sessionId, userId) => {
  const order = await orderModel.findOrderBySessionId(sessionId, userId);
  if (!order) return null; // Return null instead of throwing an error, as polling is expected to fail initially.

  return orderModel.findOrderByIdWithItems(order.id);
};
