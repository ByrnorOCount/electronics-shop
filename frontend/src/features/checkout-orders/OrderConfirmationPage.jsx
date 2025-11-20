import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import OrderDetails from "./components/OrderDetails";
import { useApi } from "../../hooks/useApi";
import { orderService } from "../../api";
import toast from "react-hot-toast";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const initialOrder = location.state?.order;

  const {
    data: orders,
    isLoading,
    isError,
    request: fetchOrders,
  } = useApi(orderService.getOrderHistory);

  useEffect(() => {
    // If we don't have an order from the navigation state (e.g., on page refresh),
    // fetch the user's order history to get the latest one.
    if (!initialOrder) {
      fetchOrders();
    }

    if (isError) {
      toast.error("Could not retrieve order details.");
    }
  }, [initialOrder, fetchOrders, isError]);

  // Determine which order to display: the one from state, or the most recent from the fetch.
  const order = initialOrder || (orders && orders[0]);

  if (isLoading && !initialOrder) {
    return (
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 text-center">
        <p>Loading your order details...</p>
      </main>
    );
  } else if (isError || !order) {
    return (
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Order Information</h1>
        <p className="text-gray-600 mb-6">
          We couldn't find any recent order details. You can view your past
          orders in your account.
        </p>
        <Link
          to="/orders"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          View Order History
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 mt-2">
              Your order has been confirmed. A confirmation email has been sent
              to you.
            </p>
            <p className="text-sm text-gray-500 mt-1">Order ID: #{order.id}</p>
          </div>

          <div className="border-t pt-6">
            <OrderDetails order={order} />
          </div>
        </div>
      </div>
    </main>
  );
}
