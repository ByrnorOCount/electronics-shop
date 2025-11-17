import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";

/**
 * Middleware to handle 404 Not Found errors for any unhandled routes.
 * This should be placed after all other routes in your app.js.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(
    httpStatus.NOT_FOUND,
    `Not Found - ${req.originalUrl}`
  );
  next(error);
};

/**
 * Global error handling middleware.
 * This should be the very last middleware in your Express app stack.
 * It catches all errors passed to `next(error)`.
 * @param {Error|ApiError} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // The ApiError class handles setting the correct statusCode and message.
  const response = {
    success: false,
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: message || "An unexpected error occurred",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(response.statusCode).json(response);
};
