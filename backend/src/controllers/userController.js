import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

/**
 * Register a new user.
 */
export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db('users')
      .insert({ first_name, last_name, email, password_hash: hashedPassword, role: 'customer' })
      .returning(['id', 'first_name', 'last_name', 'email', 'role']);

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
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
