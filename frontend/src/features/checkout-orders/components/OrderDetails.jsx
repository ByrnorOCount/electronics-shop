import React from "react";
import ItemList from "../../../components/ui/ItemList";

/**
 * Displays a summary of a completed order.
 * @param {object} props
 * @param {object} props.order - A past order object.
 */
export default function OrderDetails({ order }) {
  const items = order.items.map((item) => ({
    ...item,
    id: item.product_id,
    qty: item.quantity,
    img: item.image_url,
  }));

  const paymentMethodDisplay = {
    cod: "Cash on Delivery",
    stripe: "Stripe (Online)",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <ItemList items={items} />

      {/* Order Details */}
      <div className="space-y-2">
        <div className="text-sm">
          <p className="font-semibold">Shipping Address:</p>
          <p className="text-gray-600">{order.shipping_address}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Payment Method:</p>
          <p className="text-gray-600">
            {paymentMethodDisplay[order.payment_method] || order.payment_method}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Order Placed:</p>
          <p className="text-gray-600">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold text-lg my-4 pt-4 border-t">
        <span>Order Total</span>
        <span>${Number(order.total_amount).toFixed(2)}</span>
      </div>
    </div>
  );
}
