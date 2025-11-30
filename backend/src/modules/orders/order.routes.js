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

const router = express.Router();

// This webhook route must be public and come before authentication middleware.
// It also needs the raw body for signature verification.
router.post(
  "/webhook",
  // Use express.raw to get the raw body, which is required for Stripe signature verification
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

// All subsequent routes in this module are for authenticated users.
router.use(authenticate, isAuthenticated);

router
  .route("/")
  .post(validate(orderValidation.createOrder), createOrder)
  .get(getOrders);

router.get("/by-session/:sessionId", getOrderBySessionId);

router.post("/generate-otp", generateCheckoutOtp);
router.post(
  "/create-payment-session",
  validate(orderValidation.createPaymentSession),
  createPaymentSession
);

export default router;
