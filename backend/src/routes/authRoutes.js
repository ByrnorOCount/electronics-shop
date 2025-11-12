import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
// 1. Import the token generation function you already have
import generateToken from '../utils/generateToken.js';

const router = express.Router();

/**
 * A shared callback handler for all social authentication strategies.
 * This function runs after Passport successfully authenticates a user. It sets
 * the JWT in a secure, httpOnly cookie and redirects the user to their profile.
 */
const socialAuthCallbackHandler = (req, res) => {
  // 'req.user' is now the user object that passport.js found or created
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=social`);
  }

  // Create a JWT for this user (identical to the regular login logic)
  const token = generateToken(req.user.id, req.user.role);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Set the token in a secure, httpOnly cookie.
  // This is the secure way to handle auth tokens.
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'lax', // Provides reasonable CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
  });

  // Instead of redirecting to a callback page with the token,
  // we redirect directly to the profile page. The frontend will
  // then need to fetch the user's data.
  res.redirect(`${frontendUrl}/login?status=success`);
};

/**
 * @route   GET /api/auth/google
 * @desc    Initiates the Google authentication flow.
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // 2. We are not using sessions; we are using tokens.
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
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=social`, // Redirect to login page on failure
    session: false
  }),
  socialAuthCallbackHandler // Use the shared handler
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
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=social`,
    session: false
  }),
  socialAuthCallbackHandler // Use the shared handler
);

// We don't need /me or /logout here
// because they are already handled by JWT (in userRoutes.js)
// and on the client-side (by deleting the token).

export default router;