import httpStatus from "http-status";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";

const excludedRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/google",
  "/api/auth/facebook",
  "/api/users/forgot-password",
  "/api/users/reset-password",
  "/api/orders/webhook",
  "/api/csrf-token",
];

/**
 * Middleware to protect against CSRF attacks using the Double-Submit Cookie pattern.
 * It checks for a matching token in the request header and the `XSRF-TOKEN` cookie.
 */
export const csrfProtection = (req, res, next) => {
  // Only apply CSRF protection to state-changing methods and non-excluded routes
  const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(
    req.method
  );

  // Use `some` to check if the request path starts with any of the excluded prefixes
  const isExcluded = excludedRoutes.some((route) =>
    req.path.startsWith(route.replace("/api", ""))
  );

  if (!isStateChanging || isExcluded) {
    return next();
  }

  const tokenFromCookie = req.cookies["XSRF-TOKEN"];
  const tokenFromHeader = req.headers["x-xsrf-token"];

  if (!tokenFromCookie || !tokenFromHeader) {
    return next(new ApiError(httpStatus.FORBIDDEN, "CSRF token is missing."));
  }

  // Use a timing-safe comparison to prevent timing attacks
  try {
    crypto.timingSafeEqual(
      Buffer.from(tokenFromCookie, "utf8"),
      Buffer.from(tokenFromHeader, "utf8")
    );
  } catch (error) {
    // This will catch errors if buffers have different lengths or if tokens don't match
    console.error(
      `CSRF Token Mismatch: Cookie=${tokenFromCookie}, Header=${tokenFromHeader}`
    );
    return next(new ApiError(httpStatus.FORBIDDEN, "Invalid CSRF token."));
  }

  next();
};
