import express from 'express';
import passport from 'passport';
// 1. Import the token generation function you already have
import generateToken from '../utils/generateToken.js';

const router = express.Router();

/**
 * A shared callback handler for all social authentication strategies.
 * This function runs after Passport successfully authenticates a user.
 * It generates a JWT and redirects the user back to the frontend.
 */
const socialAuthCallbackHandler = (req, res) => {
  // 'req.user' is now the user object that passport.js found or created
  if (!req.user) {
    return res.redirect('http://localhost:5173/login?error=true');
  }

  // Create a JWT for this user (identical to the regular login logic)
  const token = generateToken(req.user.id, req.user.role);

  // Get the frontend URL from .env, with a fallback
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Remove password_hash before sending to the frontend (very important)
  delete req.user.password_hash;
  const userJson = encodeURIComponent(JSON.stringify(req.user));

  res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${userJson}`);
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
    failureRedirect: 'http://localhost:3000/login?error=true', // Redirect to login page on failure
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
    failureRedirect: 'http://localhost:3000/login?error=true',
    session: false
  }),
  socialAuthCallbackHandler // Use the shared handler
);

// We don't need /me or /logout here
// because they are already handled by JWT (in userRoutes.js)
// and on the client-side (by deleting the token).

export default router;