import express from "express";
import passport from "passport";
import {
  useGoogleStrategy,
  useFacebookStrategy,
} from "../../config/passport.js";
import {
  register,
  login,
  socialAuthCallback,
  logout,
  getMe,
} from "./auth.controller.js";
import validate from "../../core/middlewares/validation.middleware.js";
import authValidation from "./auth.validation.js";

const router = express.Router();

// --- Local Authentication ---
router.post("/register", validate(authValidation.register), register);
router.post("/login", validate(authValidation.login), login);

// --- Logout ---
router.post("/logout", logout);

// --- Get Current User ---
// This route is crucial for the frontend to verify the user's session on page load,
// especially after a social login redirect.
import { authenticate } from "../../core/middlewares/auth.middleware.js";
router.get("/me", authenticate, getMe);

// --- Social Login Routes ---

// Google OAuth - Initialize strategy just-in-time
router.get("/google", (req, res, next) => {
  useGoogleStrategy();
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    The callback URL that Google redirects to.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=social`, // Redirect to login page on failure
    session: false,
  }),
  socialAuthCallback // Use the new controller function
);

// Facebook OAuth - Initialize strategy just-in-time
router.get("/facebook", (req, res, next) => {
  useFacebookStrategy();
  passport.authenticate("facebook", { session: false })(req, res, next);
});

/**
 * @route   GET /api/auth/facebook/callback
 * @desc    The callback URL that Facebook redirects to.
 */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=social`,
    session: false,
  }),
  socialAuthCallback // Use the new controller function
);

export default router;
