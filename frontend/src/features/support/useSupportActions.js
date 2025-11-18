import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { supportService } from "../../api";
import { submitTicket as submitTicketAction } from "./supportSlice";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to manage support-related actions.
 * It encapsulates the logic for submitting a support ticket.
 *
 * @returns {{
 *  submitTicket: (data: { subject: string; message: string; }) => Promise<boolean>;
 *  isLoading: boolean;
 *  error: Error | null;
 * }}
 */
export const useSupportActions = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitTicket = async ({ subject, message }) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTicket = await supportService.submitTicket({ subject, message });
      dispatch(submitTicketAction.fulfilled(newTicket)); // Manually dispatch fulfilled action
      toast.success("Support ticket submitted successfully!");
      return true;
    } catch (err) {
      logger.error("Failed to submit ticket", err);
      const message = err.response?.data?.message || "Failed to submit ticket.";
      toast.error(message);
      setError(err);
      // Dispatch rejected action if needed, though local state might be sufficient
      // dispatch(submitTicketAction.rejected(err, null, { subject, message }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitTicket, isLoading, error };
};
