import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendVerificationEmail, sendOtpEmail } from '../services/emailService.js';
import db from '../config/db.js';

/**
 * Register a new user.
 */
export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // Enforce password complexity
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await db('users')
      .insert({
        first_name,
        last_name,
        email,
        password_hash: hashedPassword,
        role: 'customer',
        is_verified: false,
        email_verification_token: verificationToken,
      })
      .returning('*');

    // For development convenience, log the verification token to the console.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n--- EMAIL VERIFICATION --- \nUser: ${user.email}\nToken: ${verificationToken}\n--------------------------\n`);
    }

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * Log in a user.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.is_verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    delete user.password_hash;

    res.status(200).json({ message: 'Login successful.', token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * Get user profile.
 * @route GET /api/users/me
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  // The user object is attached to the request by the `protect` middleware
  res.status(200).json(req.user);
};

/**
 * Update user profile.
 * @route PUT /api/users/me
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  const { first_name, last_name, email } = req.body;

  // Build an object with only the fields that were actually provided in the request.
  const updateData = {};
  if (first_name) updateData.first_name = first_name;
  if (last_name) updateData.last_name = last_name;
  if (email) updateData.email = email;

  // If no valid fields were provided, return a bad request error.
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update.' });
  }

  try {
    const [updatedUser] = await db('users')
      .where({ id: req.user.id })
      .update(updateData)
      .returning(['id', 'first_name', 'last_name', 'email', 'role']);

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};

/**
 * Handle a forgot password request.
 * @route POST /api/users/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db('users').where({ email }).first();

    if (!user) {
      // Don't reveal if a user exists or not for security reasons
      return res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // For development convenience, log the token to the console.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n--- PASSWORD RESET --- \nUser: ${user.email}\nToken: ${resetToken}\n----------------------\n`);
    }

    // Set token and expiration on user record
    await db('users')
      .where({ id: user.id })
      .update({
        password_reset_token: hashedToken,
        password_reset_expires: db.raw("NOW() + INTERVAL '1 hour'"),
      });

    // Send the email
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Get all notifications for the logged-in user.
 * @route GET /api/users/me/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await db('notifications').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications.' });
  }
};

/**
 * Verify user's email using a token.
 * @route GET /api/users/verify-email/:token
 * @access Public
 */
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await db('users').where({ email_verification_token: token }).first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    await db('users').where({ id: user.id }).update({
      is_verified: true,
      email_verification_token: null,
    });

    // In a real frontend app, you would redirect to the login page with a success message.
    res.status(200).send('<h1>Email verified successfully!</h1><p>You can now close this tab and log in.</p>');
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Server error during email verification.' });
  }
};

/**
 * Reset password using a token.
 * @route POST /api/users/reset-password/:token
 * @access Public
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  // Hash the incoming token to match the one in the DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await db('users')
      .where({ password_reset_token: hashedToken })
      .andWhere('password_reset_expires', '>', db.raw('NOW()'))
      .first();

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);
    await db('users').where({ id: user.id }).update({
      password_hash: hashedPassword,
      password_reset_token: null,
      password_reset_expires: null,
    });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
