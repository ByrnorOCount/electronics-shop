import * as authService from "./auth.service.js";
import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";
import logger from "../../config/logger.js";
import env from "../../config/env.js";

/**
 * @route POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    // In a real app, you would now trigger an email verification flow.
    const { password_hash, ...userWithoutPassword } = user;
    res
      .status(httpStatus.CREATED)
      .json(
        new ApiResponse(
          httpStatus.CREATED,
          userWithoutPassword,
          "Registration successful. Please check your email to verify your account."
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.login(email, password);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, { user, token }, "Login successful.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the redirect from social login providers.
 * This controller is hit after the passport middleware has successfully authenticated the user.
 */
export const socialAuthCallback = async (req, res, next) => {
  try {
    // The passport middleware attaches the user profile to req.user.
    // The service layer handles finding/creating the user and generating the token.
    const { token } = await authService.handleSocialLogin(req.user);

    // Set the token in a secure, httpOnly cookie for the browser.
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Redirect to the frontend login page with a success status.
    // This is the critical step that tells the frontend to fetch the user's
    // profile and finalize the login state.
    logger.info(
      `Social login successful for user ID: ${req.user.id}. Redirecting to frontend.`
    );
    res.redirect(`${env.FRONTEND_URL}/login?status=success`);
  } catch (error) {
    // If anything goes wrong, redirect to the login page with an error.
    logger.error("Social login error:", error);
    res.redirect(`${env.FRONTEND_URL}/login?error=social_login_failed`);
  }
};

/**
 * @route POST /api/auth/logout
 */
export const logout = (req, res, next) => {
  // Clear the authentication token cookie (used for social login sessions).
  res.clearCookie("jwt");

  // Also clear the CSRF token cookie for a complete and secure logout.
  res.clearCookie("XSRF-TOKEN", { path: "/" });

  // If using passport sessions, this would be the way to log out.
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, null, "Logged out successfully"));
  });
};
