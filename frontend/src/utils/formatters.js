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
