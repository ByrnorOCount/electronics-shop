import Stripe from "stripe";
import * as orderService from "./order.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";
import logger from "../../config/logger.js";
import env from "../../config/env.js";

// TODO: Add additional payment methods beside Stripe in the future

/**
 * Generate and send an OTP for checkout verification.
 * @route POST /api/orders/generate-otp
 * @access Private
 */
export const generateCheckoutOtp = async (req, res) => {
  try {
    await orderService.generateAndSendOtp(req.user);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          null,
          "An OTP has been sent to your email."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a payment session for online payments (Stripe).
 * @route POST /api/orders/create-payment-session
 * @access Private
 */
export const createPaymentSession = async (req, res, next) => {
  // 'stripe'
  const { paymentMethod, shippingAddress } = req.body;
  const userId = req.user.id;

  try {
    const paymentData = await orderService.createOnlinePaymentSession(
      paymentMethod,
      userId,
      shippingAddress
    );
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
    const finalOrder = await orderService.createCodOrder(
      userId,
      shippingAddress,
      otp
    );
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          finalOrder,
          "Order created successfully"
        )
      );
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
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, ordersWithItems));
  } catch (error) {
    next(error);
  }
};

/**
 * Get an order by its Stripe session ID.
 * @route GET /api/orders/by-session/:sessionId
 * @access Private
 */
export const getOrderBySessionId = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const order = await orderService.getOrderBySessionId(
      sessionId,
      req.user.id
    );
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, order, "Order retrieved."));
  } catch (error) {
    next(error);
  }
};

/**
 * Handles incoming webhooks from payment providers (Stripe).
 * @route POST /api/orders/webhook
 * @access Public (verified by signature/hash)
 */
export const handlePaymentWebhook = async (req, res) => {
  logger.info("Stripe webhook endpoint was hit."); // <-- ADD THIS LINE
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  // --- Stripe Webhook Handling ---
  const stripeSignature = req.headers["stripe-signature"];
  if (stripeSignature) {
    // Log the raw body to ensure it's being received correctly before parsing.
    logger.info("Received a request to the Stripe webhook endpoint.", {
      stripeSignature,
      bodyLength: req.body.length,
    });
    const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // Use req.body, as express.raw() populates it with the buffer
        stripeSignature,
        endpointSecret
      );
    } catch (err) {
      logger.error(
        "⚠️ Webhook signature verification failed. Check that the `STRIPE_WEBHOOK_SECRET` is correct and that the request body is raw.",
        {
          errorMessage: err.message,
        }
      );
      return res.sendStatus(400);
    }

    logger.info(`Received Stripe webhook event: ${event.type}`);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      logger.info("Processing 'checkout.session.completed' event.", {
        sessionId: session.id,
        paymentIntent: session.payment_intent,
      });
      // Retrieve userId and shippingAddress from the metadata we set earlier.
      const { userId, shippingAddress } = session.metadata;

      try {
        // Create the order and get the new order's ID
        const newOrder = await orderService.createOrderInTransaction(
          Number(userId),
          shippingAddress,
          "stripe",
          {
            transactionId: session.payment_intent,
            sessionId: session.id, // Pass the session ID here
          }
        );

        // After successful creation, trigger the confirmation email.
        // This requires fetching the full order details.
        await orderService.sendOrderConfirmationEmailForOrder(newOrder.id);

        logger.info(
          `✅ Order #${newOrder.id} created successfully for user ${userId} via Stripe.`
        );
      } catch (error) {
        logger.error(
          "❌ Failed to create order from Stripe webhook. Session data included for debugging.",
          {
            errorMessage: error.message,
            stripeSession: session,
          }
        );
        return res.status(500).json({ message: "Error processing order." });
      }
    }

    res.status(200).json({ received: true });
    return;
  }

  res.status(400).json({ message: "Unrecognized webhook source." });
};
