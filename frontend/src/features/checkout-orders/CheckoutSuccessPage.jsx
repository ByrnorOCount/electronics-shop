import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { clearCart } from "../cart/cartSlice";
import { orderService } from "../../api";
import toast from "react-hot-toast";
import Spinner from "../../components/ui/Spinner";
import logger from "../../utils/logger";

/**
 * This page is the landing spot after a successful Stripe payment.
 * It waits for the backend webhook to create the order, then redirects
 * to the order confirmation page.
 */
export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(true);
  const sessionId = searchParams.get("session_id");
  const attempts = useRef(0);
  const pollingStarted = useRef(false); // Flag to prevent double execution in StrictMode
  const maxAttempts = 10; // Poll for a total of 20 seconds

  useEffect(() => {
    if (!sessionId) {
      toast.error("No payment session found. Redirecting to home.");
      navigate("/");
      return;
    }

    // Prevent the effect from running twice in development due to StrictMode
    if (pollingStarted.current) {
      return;
    }

    // The order is created via a backend webhook, which can take a few seconds.
    // We need to poll the backend to find the order associated with this session.
    const findOrder = async () => {
      attempts.current += 1;
      logger.info(`Searching for order... Attempt ${attempts.current}`);

      try {
        const order = await orderService.getOrderBySessionId(sessionId);
        if (order) {
          setIsSearching(false);
          toast.success("Payment successful! Your order has been confirmed.");
          // Redirect to the confirmation page, passing the order details.
          navigate("/order-confirmation", {
            state: { order },
            replace: true,
          });
          return; // Stop polling
        }
      } catch (error) {
        // This is expected if the order isn't created yet, so we don't show a toast.
        logger.warn("Order not found yet, will retry.", error);
      }

      if (attempts.current >= maxAttempts) {
        setIsSearching(false);
        toast.error(
          "Could not confirm order automatically. Please check your order history or contact support."
        );
        navigate("/orders");
      }
    };

    // Start polling immediately, then set an interval.
    pollingStarted.current = true; // Set the flag
    const intervalId = setInterval(findOrder, 2000); // Poll every 2 seconds

    // Clear cart immediately on success page
    dispatch(clearCart());
    findOrder(); // Initial check

    // Cleanup function to stop polling if the component unmounts
    return () => clearInterval(intervalId);
  }, [sessionId, navigate, dispatch]);

  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
      <Spinner size={12} />
      <h1 className="text-2xl font-semibold mt-4">Processing Your Order...</h1>
      <p className="text-gray-600 mt-2">
        Thank you for your payment! Please wait a moment while we confirm your
        order.
      </p>
    </main>
  );
}
