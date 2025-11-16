import * as UserService from './user.service.js';

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
  try {
    // Only allow specific fields to be updated
    const { first_name, last_name } = req.body;
    const updateData = { first_name, last_name };
    const result = await UserService.updateUser(req.user.id, updateData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.message.includes('No fields')) return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};

/**
 * Change user password.
 * @route PUT /api/users/me/password
 * @access Private
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await UserService.changeUserPassword(req.user.id, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error changing password:', error);
    if (error.message.includes('incorrect')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

/**
 * Handle a forgot password request.
 * @route POST /api/users/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const result = await UserService.requestPasswordReset(req.body.email);
    // Always return 200 to prevent email enumeration
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Verify user's email using a token.
 * @route GET /api/users/verify-email/:token
 * @access Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const result = await UserService.verifyUserEmail(req.params.token);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error during email verification:', error);
    if (error.message.includes('Invalid')) return res.status(400).json({ message: error.message });
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
  try {
    const result = await UserService.resetUserPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in reset password:', error);
    if (error.message.includes('invalid or has expired')) return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error.' });
  }
};
