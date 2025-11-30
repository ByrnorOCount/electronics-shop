import express from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
const router = express.Router();

// --- Protected Routes ---
// These routes require a user to be logged in.
router
  .route("/me")
  .get(authenticate, isAuthenticated, userController.getUserProfile)
  .put(
    express.json(),
    authenticate,
    isAuthenticated,
    userController.updateUserProfile
  );

// --- Public Routes ---
// These routes are for account management and do not require an active session.
router.post(
  "/verify-email",
  express.json(),
  validate(userValidation.verifyEmail),
  userController.verifyEmail
);
router.post(
  "/forgot-password",
  express.json(),
  validate(userValidation.forgotPassword),
  userController.forgotPassword
);
router.post(
  "/reset-password",
  express.json(),
  validate(userValidation.resetPassword),
  userController.resetPassword
);

export default router;
