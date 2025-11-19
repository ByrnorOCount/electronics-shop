import { useApi } from "../../hooks/useApi";
import { supportService } from "../../api";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to manage support-related actions.
 * It encapsulates the logic for submitting a support ticket.
 * @returns {{
 *  submitTicket: (data: { subject: string; message: string; }, onFinish?: Function) => Promise<boolean>;
 *  isLoading: boolean;
 *  error: Error | null;
 * }}
 */
export const useSupportActions = () => {
  const {
    isLoading,
    error,
    request: submit,
  } = useApi(supportService.submitTicket);

  const submitTicket = async ({ subject, message }, onFinish) => {
    try {
      await submit({ subject, message });
      toast.success("Support ticket submitted successfully!");
      if (onFinish) onFinish(); // Refresh data on the calling component
      return true;
    } catch (err) {
      logger.error("Failed to submit ticket", err);
      const message = err.response?.data?.message || "Failed to submit ticket.";
      toast.error(message);
      return false;
    }
  };

  return { submitTicket, isLoading, error };
};
