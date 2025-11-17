import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import CartSummary from "../cart/components/OrderSummary";
import orderService from "./orderService";
import Button from "../../components/ui/Button";
import { clearCart } from "../cart/cartSlice";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod', 'stripe', 'vnpay'
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await orderService.generateOtp();
      toast.success("An OTP has been sent to your email.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress) {
      toast.error("Shipping address is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "cod") {
        if (!otp) {
          setLoading(false);
          toast.error("Please enter the OTP sent to your email.");
          return;
        }
        const { order } = await orderService.createCodOrder(
          shippingAddress,
          otp
        );
        dispatch(clearCart()); // Clear the cart in Redux state
        navigate("/order-confirmation", { state: { order } });
      } else {
        // Handle online payments
        const { url } = await orderService.createPaymentSession(paymentMethod);
        // Redirect user to the payment provider's page
        window.location.href = url;
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow max-w-screen-xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-6"
        >
          {/* Shipping Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="4"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="123 Main St, Anytown, USA"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-2">
              {["cod", "stripe", "vnpay"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-3 border rounded-md has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="font-medium capitalize">
                    {method === "cod" ? "Cash on Delivery" : method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional UI for COD */}
          {paymentMethod === "cod" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium">Verify Your Order</h3>
              <p className="text-sm text-gray-500 mb-4">
                For security, we need to verify your purchase. Please generate
                and enter the One-Time Password (OTP) sent to your email.
              </p>
              <div className="flex items-end gap-4">
                <div className="flex-grow">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="6-digit code"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleGenerateOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Get OTP"}
                </Button>
              </div>
            </div>
          )}

          {/* Error and Notification Messages */}
          {error && !toast.isActive("error-toast") && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order"
              : "Proceed to Payment"}
          </Button>
        </form>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </main>
  );
}
