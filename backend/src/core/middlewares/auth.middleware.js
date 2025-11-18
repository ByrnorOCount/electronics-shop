import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import db from "../../config/db.js";
import ApiError from "../utils/ApiError.js";
import logger from "../../config/logger.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Prioritize the Authorization header (standard JWT login)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback to the cookie (for social login session verification)
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      // The cookie is a one-time use token for session establishment.
      // Clear it after reading to prevent it from being used again on subsequent requests,
      // forcing the client to rely on the Authorization header.
      res.clearCookie("jwt", {
        httpOnly: true,
      });
    }

    if (!token) {
      // No token found, proceed as a guest.
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the full user object from the database.
    const user = await db("users").where({ id: decoded.id }).first();

    // If a user is not found in the DB, the token is invalid.
    if (!user) {
      // Invalid token (user deleted), proceed as a guest.
      return next();
    }

    // Remove the password hash before attaching the user object to the request.
    delete user.password_hash;

    // Security Check 1: Ensure the user has verified their email.
    // This is critical and should be re-enabled. Social logins should either
    // be marked as verified by default or prompt the user to set an email.
    // if (!user.is_verified && user.provider === null) { // Example: only check for non-social users
    //   return next(new ApiError(httpStatus.FORBIDDEN, 'Please verify your email to continue.'));
    // }

    // Security Check 2: Invalidate token if password was changed after the token was issued.
    if (user.password_changed_at) {
      const passwordChangedTimestamp = parseInt(
        new Date(user.password_changed_at).getTime() / 1000,
        10
      );
      if (decoded.iat < passwordChangedTimestamp) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "User recently changed password. Please log in again."
          )
        );
      }
    }

    // Attach user to the request object
    req.user = user;
    next(); // Proceed to the protected route
  } catch (error) {
    // If the token is expired, malformed, or invalid for any reason,
    // don't block the request. Just log it and proceed as a guest.
    // This prevents errors for users with stale tokens.
    logger.warn(
      `Authentication failed: ${error.message}. Proceeding as guest.`
    );
    next();
  }
};

/**
 * Middleware to ensure a user is authenticated.
 * Use this after the `authenticate` middleware on protected routes.
 * It checks if `req.user` has been set.
 */
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  next(
    new ApiError(
      httpStatus.UNAUTHORIZED,
      "Authentication required. Please log in."
    )
  );
};

export const isStaff = (req, res, next) => {
  // Admins are also considered staff for privilege purposes
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    next(
      new ApiError(httpStatus.FORBIDDEN, "Not authorized as a staff member.")
    );
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ApiError(httpStatus.FORBIDDEN, "Not authorized as an admin."));
  }
};
