import * as userService from "./user.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";

/**
 * Get user profile.
 * @route GET /api/users/me
 * @access Private
 */
export const getUserProfile = async (req, res, next) => {
  // The user object is attached to the request by the `authenticate` middleware
  res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(
        httpStatus.OK,
        req.user,
        "Profile retrieved successfully."
      )
    );
};

/**
 * Update user profile.
 * @route PUT /api/users/me
 * @access Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, req.body);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          updatedUser,
          "Profile updated successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password.
 * @route POST /api/users/change-password
 * @access Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changeUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, null, "Password changed successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Handle a forgot password request.
 * @route POST /api/users/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          null,
          "If a user with that email exists, a reset link has been sent."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user's email using a token.
 * @route POST /api/users/verify-email
 * @access Public
 */
export const verifyEmail = async (req, res, next) => {
  try {
    await userService.verifyUserEmail(req.body.token);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, null, "Email verified successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using a token.
 * @route POST /api/users/reset-password
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await userService.resetUserPassword(token, password);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          httpStatus.OK,
          null,
          "Password has been reset successfully."
        )
      );
  } catch (error) {
    next(error);
  }
};
