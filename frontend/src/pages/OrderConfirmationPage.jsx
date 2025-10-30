import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const { order } = location.state || {}; // Safely destructure state

  if (!order) {
    return (
      <main className="flex-grow max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Order Information</h1>
        <p className="text-gray-600 mb-6">We couldn't find any recent order details. You can view your past orders in your account.</p>
        <Link to="/orders" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          View Order History
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Thank You for Your Order!</h1>
          <p className="text-gray-600 mt-2">Your order has been confirmed. A confirmation email has been sent to you.</p>
          <p className="text-sm text-gray-500 mt-1">Order ID: #{order.id}</p>
        </div>

        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals and Shipping */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${Number(order.total_amount).toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600"><strong>Shipping to:</strong> {order.shipping_address}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
