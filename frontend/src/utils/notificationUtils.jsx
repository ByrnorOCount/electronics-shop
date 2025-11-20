import React from "react";
import { formatStatus } from "./formatters";

/**
 * Parses a notification message and returns formatted JSX if it matches
 * a specific pattern (e.g., ticket status updates).
 * @param {string} message - The raw notification message.
 * @returns {React.ReactNode} - The formatted message as JSX or the original string.
 */
export const renderFormattedNotificationMessage = (message) => {
  // Regex to capture the parts of the ticket status update message
  const ticketStatusUpdateRegex =
    /(The status of your support ticket #\d+ has been updated to ")(open|in_progress|closed)(".)/;
  const match = message.match(ticketStatusUpdateRegex);

  if (match) {
    const prefix = match[1];
    const rawStatus = match[2];
    const suffix = match[3];
    const formattedStatus = formatStatus(rawStatus);
    return (
      <>
        {prefix}
        <span className="font-semibold">{formattedStatus}</span>
        {suffix}
      </>
    );
  }
  return message;
};
