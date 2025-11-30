import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { orderService } from "../../api";
import { clearCart } from "../cart/cartSlice";
import toast from "react-hot-toast";
import logger from "../../utils/logger";

/**
 * A custom hook to manage order-related actions like creating orders and generating OTPs.
 * It centralizes logic for API calls, state management (loading, errors), and user feedback.
 *
 * @returns {{
 *  createOrder: (data: {
 *    shippingAddress: string;
 *    paymentMethod: 'cod'|'stripe';
 *    otp?: string;
 *  }) => Promise<void>;
 *  generateOtp: () => Promise<void>;
 *  isLoading: boolean;
 *  error: string | null;
 * }}
 */
export const useOrderActions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generates and sends an OTP to the user's email for order verification.
   */
  const generateOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await orderService.generateOtp();
      toast.success("An OTP has been sent to your email.");
    } catch (err) {
      logger.error("Failed to send OTP", err);
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Creates an order based on the selected payment method.
   * For 'cod', it creates the order directly.
   * For 'stripe', it redirects to the payment page.
   */
  const createOrder = async ({ shippingAddress, paymentMethod, otp }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (paymentMethod === "cod") {
        const order = await orderService.createCodOrder(shippingAddress, otp);
        dispatch(clearCart());
        navigate("/order-confirmation", { state: { order }, replace: true });
      } else {
        const { url } = await orderService.createPaymentSession(
          paymentMethod,
          shippingAddress
        );
        window.location.href = url;
      }
    } catch (err) {
      logger.error("Order creation failed", err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createOrder, generateOtp, isLoading, error };
};
