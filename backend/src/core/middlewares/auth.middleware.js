import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import db from "../../config/db.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Check for JWT in the Authorization header (for standard login)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. If not in header, check for JWT in the cookie (for social login)
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Not authorized, no token provided."
        )
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the full user object from the database.
    const user = await db("users").where({ id: decoded.id }).first();

    // If a user is not found in the DB, the token is invalid.
    if (!user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Not authorized, user not found.")
      );
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
    // Catch JWT errors (e.g., expired, malformed) and pass them to the error handler.
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, "Not authorized, token failed.")
    );
  }
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
