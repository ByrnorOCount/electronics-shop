import express from "express";
import {
  createOrder,
  getOrders,
  generateCheckoutOtp,
  createPaymentSession,
  handlePaymentWebhook,
} from "./order.controller.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as orderValidation from "./order.validation.js";

const router = express.Router();

// This webhook route must be public and come before authentication middleware.
// It also needs the raw body for signature verification.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaymentWebhook
);

// All subsequent routes in this module are for authenticated users.
router.use(authenticate);

router
  .route("/")
  .get(getOrders)
  .post(validate(orderValidation.createOrder), createOrder);

router.post("/generate-otp", generateCheckoutOtp);
router.post(
  "/create-payment-session",
  validate(orderValidation.createPaymentSession),
  createPaymentSession
);

export default router;
