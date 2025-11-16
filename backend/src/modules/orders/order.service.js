import crypto from 'crypto';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import Stripe from 'stripe';
import * as orderModel from './order.model.js';
import * as cartModel from '../cart/cart.model.js';
import { sendOtpEmail } from '../../core/integrations/email.service.js';
import { createOrderFromCart } from '../../core/integrations/payment.service.js';
import ApiError from '../../core/utils/ApiError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
const createStripeSession = async (cartItems, userId) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.VNPAY_RETURN_URL}?success=true`,
        cancel_url: `${process.env.VNPAY_RETURN_URL}?success=false`,
        metadata: { userId },
    });
    return { url: session.url };
};

const paymentStrategies = {
    stripe: createStripeSession,
};

/**
 * Create a payment session for online payments.
 * @param {string} paymentMethod - 'stripe' or 'vnpay'.
 * @param {number} userId
 * @param {string} ipAddr
 * @returns {Promise<object>}
 */
export const createOnlinePaymentSession = async (paymentMethod, userId) => {
    const cartItems = await cartModel.findByUserId(userId);
    if (cartItems.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create payment with an empty cart.');
    }

    const paymentHandler = paymentStrategies[paymentMethod];
    if (!paymentHandler) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid online payment method specified.');
    }

    const paymentData = await paymentHandler(cartItems, userId);
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
    const isOtpValid = user.otp_hash && (await bcrypt.compare(otp, user.otp_hash));
    const isOtpExpired = new Date() > new Date(user.otp_expires);

    if (!isOtpValid || isOtpExpired) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP.');
    }

    const cartItems = await orderModel.findCartItemsByUserId(userId);
    if (cartItems.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create an order with an empty cart.');
    }

    const newOrder = await createOrderFromCart(userId, shippingAddress, 'cod');
    await orderModel.clearUserOtp(userId);

    const finalOrder = await orderModel.findOrderByIdWithItems(newOrder.id);
    return finalOrder;
};

/**
 * Get all orders for a user.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getOrdersForUser = (userId) => {
    return orderModel.findOrdersByUserIdWithItems(userId);
};
