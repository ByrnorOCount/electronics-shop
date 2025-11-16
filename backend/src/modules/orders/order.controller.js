import Stripe from 'stripe';
import httpStatus from 'http-status';
import * as orderService from './order.service.js';
import ApiResponse from '../../core/utils/ApiResponse.js';
import { createOrderFromCart } from '../../core/integrations/payment.service.js';

// TODO: Add additional payment methods beside Stripe in the future

/**
 * Generate and send an OTP for checkout verification.
 * @route POST /api/orders/generate-otp
 * @access Private
 */
export const generateCheckoutOtp = async (req, res) => {
  try {
    await orderService.generateAndSendOtp(req.user);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'An OTP has been sent to your email.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a payment session for online payments (Stripe, VNPay).
 * @route POST /api/orders/create-payment-session
 * @access Private
 */
export const createPaymentSession = async (req, res, next) => {
  const { paymentMethod } = req.body; // 'stripe' or 'vnpay'
  const userId = req.user.id;

  try {
    const paymentData = await orderService.createOnlinePaymentSession(paymentMethod, userId);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, paymentData));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order from the user's cart.
 * @route POST /api/orders (for Cash on Delivery)
 * @access Private
 */
export const createOrder = async (req, res, next) => {
  const { shippingAddress, paymentMethod, otp } = req.body;
  const userId = req.user.id;

  try {
    const finalOrder = await orderService.createCodOrder(userId, shippingAddress, otp);
    res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, finalOrder, 'Order created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders for the logged-in user.
 * @route GET /api/orders
 * @access Private
 */
export const getOrders = async (req, res, next) => {
  try {
    const ordersWithItems = await orderService.getOrdersForUser(req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, ordersWithItems));
  } catch (error) {
    next(error);
  }
};

/**
 * Handles incoming webhooks from payment providers (Stripe, VNPay).
 * @route POST /api/orders/webhook
 * @access Public (verified by signature/hash)
 */
export const handlePaymentWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

  res.status(400).json({ message: 'Unrecognized webhook source.' });
};