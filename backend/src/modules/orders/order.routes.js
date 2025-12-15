import express from "express";
import {
  createOrder,
  getOrderBySessionId,
  getOrders,
  generateCheckoutOtp,
  createPaymentSession,
  handlePaymentWebhook,
} from "./order.controller.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as orderValidation from "./order.validation.js";

const webhookRouter = express.Router();
const orderRouter = express.Router();

// This webhook route must be public and come before authentication middleware.
// It also needs the raw body for signature verification.
webhookRouter.post(
  "/webhook",
  // Use express.raw to get the raw body, which is required for Stripe signature verification
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

// All subsequent routes in the main orderRouter are for authenticated users.
orderRouter.use(authenticate, isAuthenticated);

orderRouter
  .route("/")
  .post(validate(orderValidation.createOrder), createOrder)
  .get(getOrders);

orderRouter.get("/by-session/:sessionId", getOrderBySessionId);

orderRouter.post("/generate-otp", generateCheckoutOtp);
orderRouter.post(
  "/create-payment-session",
  validate(orderValidation.createPaymentSession),
  createPaymentSession
);

export { webhookRouter, orderRouter };
