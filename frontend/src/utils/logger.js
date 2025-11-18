/**
 * A simple logger utility for the frontend.
 *
 * It wraps the native `console` object and only outputs logs in non-production environments.
 * This prevents verbose debugging messages from appearing in the browser console on the live site.
 * In the future, this can be extended to send logs to a remote logging service (e.g., Sentry, LogRocket).
 */

const isDevelopment = import.meta.env.NODE_ENV === "development";

const logger = {
  /**
   * Logs informational messages. Only active in development.
   * @param {...any} args - The values to log.
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  /**
   * Logs error messages. This will log in both development and production
   * as errors are often important to see.
   * @param {...any} args - The values to log as an error.
   */
  error: (...args) => {
    console.error(...args);
  },
};

export default logger;
