import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import orderService from '../services/orderService';
import OrderSummary from '../components/OrderSummary';

const OrderItem = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
      >
        <div className="flex-1">
          <p className="font-semibold">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex-1 text-center">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {order.status}
          </span>
        </div>
        <div className="flex-1 text-right">
          <p className="font-semibold">${Number(order.total_amount).toFixed(2)}</p>
        </div>
        <svg className={`w-5 h-5 ml-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t bg-gray-50">
          <OrderSummary order={order} />
        </div>
      )}
    </div>
  );
};

export default function OrderHistoryPage() {
  const { data: orders, loading, error, request: fetchOrders } = useApi(orderService.getOrderHistory);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  let content;
  if (loading) {
    content = <p>Loading your order history...</p>;
  } else if (error) {
    console.error("Failed to load order history:", error);
    content = <p className="text-red-500">Could not load your order history. Please try again later.</p>;
  } else if (orders && orders.length > 0) {
    content = (
      <div className="space-y-4">
        {orders.map((order) => <OrderItem key={order.id} order={order} />)}
      </div>
    );
  } else {
    content = <p className="text-gray-600">You have not placed any orders yet.</p>;
  }

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {content}
    </main>
  );
}
