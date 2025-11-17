import express from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";

const router = express.Router();

// Authenticated routes for user profile
router.use(authenticate);

// Public routes for account management
router.post(
  "/verify-email",
  validate(userValidation.verifyEmail),
  userController.verifyEmail
);
router.post(
  "/forgot-password",
  validate(userValidation.forgotPassword),
  userController.forgotPassword
);
router.post(
  "/reset-password",
  validate(userValidation.resetPassword),
  userController.resetPassword
);

export default router;
