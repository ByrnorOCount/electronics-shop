/**
 * Formats a status string (e.g., 'in_progress') into a human-readable,
 * capitalized format (e.g., 'In Progress').
 * @param {string} status - The status string to format.
 * @returns {string} The formatted status string.
 */
export const formatStatus = (status) => {
  if (!status) return "";
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a number as a currency string (e.g., USD).
 * @param {number} amount - The numerical amount to format.
 * @param {string} currency - The currency code (e.g., 'USD').
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (typeof amount !== "number" || amount === null || isNaN(amount)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
