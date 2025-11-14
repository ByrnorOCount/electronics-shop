import express from 'express';
import passport from 'passport';
import { socialAuthCallback } from './auth.controller.js';

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiates the Google authentication flow.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // We are not using sessions; we are using tokens.
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    The callback URL that Google redirects to.
 */
router.get(
  '/google/callback',
  // 3. Have Passport handle the callback, without using sessions
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=social`, // Redirect to login page on failure
    session: false
  }),
  socialAuthCallback // Use the new controller function
);

/**
 * @route   GET /api/auth/facebook
 * @desc    Initiates the Facebook authentication flow.
 */
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false
  })
);

/**
 * @route   GET /api/auth/facebook/callback
 * @desc    The callback URL that Facebook redirects to.
 */
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=social`,
    session: false
  }),
  socialAuthCallback // Use the new controller function
);

export default router;