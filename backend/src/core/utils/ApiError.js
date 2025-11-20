class ApiError extends Error {
  /**
   * Creates a custom API Error.
   * This is used for operational, predictable errors that should be sent to the client.
   * TODO: Display error on frontend in a user-friendly way.
   *
   * @param {number} statusCode - The HTTP status code of the error.
   * @param {string} message - The error message.
   * @param {boolean} [isOperational=true] - A flag to distinguish operational errors from programming errors.
   * @param {string} [stack=''] - The error stack trace.
   */
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
