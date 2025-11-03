import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * A component that displays the cart's subtotal and a checkout button.
 * Can also display a summary of a past order if an `order` prop is provided.
 * @param {object} props
 * @param {object} [props.order] - A past order object. If not provided, it will display the current cart.
 */
export default function OrderSummary({ order }) {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { token } = useAppSelector((state) => state.auth);

  // Determine the source of items and totals
  const isFromOrder = !!order;
  const items = isFromOrder ? order.items.map(item => ({ ...item, id: item.product_id, qty: item.quantity, img: item.image_url })) : cartItems;
  const subtotal = isFromOrder ? order.total_amount : items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);
  
  // For live cart, calculate estimates. For past orders, these are not needed.
  const shipping = !isFromOrder && subtotal > 0 ? 5.00 : 0;
  const tax = !isFromOrder ? subtotal * 0.05 : 0;
  const total = isFromOrder ? order.total_amount : subtotal + shipping + tax;
  const paymentMethodDisplay = {
    cod: 'Cash on Delivery',
    stripe: 'Stripe (Online)',
    vnpay: 'VNPay (Online)',
  };

  // The checkout link depends on whether the user is logged in.
  const CheckoutButton = useMemo(() => {
    if (isFromOrder) return null; // Don't show a checkout button for a past order

    if (token) {
      return <Link to="/checkout" className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Proceed to Checkout</Link>;
    }
    return <Link to="/login" state={{ from: '/cart' }} className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Login to Continue</Link>;
  }, [token, isFromOrder]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Item List */}
      <div className={`space-y-4 mb-4 ${isFromOrder ? '' : 'max-h-60 overflow-y-auto pr-2'}`}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">Qty: {item.qty}</p>
              {item.stock !== undefined && !isFromOrder && <p className="text-xs text-gray-500">In Stock: {item.stock}</p>}
            </div>
            <span className="font-medium text-sm">${(Number(item.price) * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {isFromOrder ? (
          <>
            <div className="text-sm">
              <p className="font-semibold">Shipping Address:</p>
              <p className="text-gray-600">{order.shipping_address}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Payment Method:</p>
              <p className="text-gray-600">{paymentMethodDisplay[order.payment_method] || order.payment_method}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold">Order Placed:</p>
              <p className="text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping estimate</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax estimate</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between font-bold text-lg my-4 pt-4 border-t">
        <span>{isFromOrder ? 'Order Total' : 'Order total'}</span>
        <span>${Number(total).toFixed(2)}</span>
      </div>
      {CheckoutButton}
    </div>
  );
}
