import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * A component that displays the cart's subtotal and a checkout button.
 */
export default function CartSummary() {
  const { items } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);

  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);
  // Placeholder values for shipping and tax. In a real app, these would
  // likely be calculated based on address, cart contents, or API data.
  const shipping = subtotal > 0 ? 5.00 : 0; // Example: $5 flat rate, free if cart is empty
  const tax = subtotal * 0.05; // Example: 5% tax
  const total = subtotal + shipping + tax;

  // The checkout link depends on whether the user is logged in.
  const CheckoutButton = useMemo(() => {
    if (token) {
      return <Link to="/checkout" className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Proceed to Checkout</Link>;
    }
    return <Link to="/login" state={{ from: '/cart' }} className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">Login to Continue</Link>;
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Item List */}
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">Qty: {item.qty}</p>
            </div>
            <span className="font-medium text-sm">${(Number(item.price) * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
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
      </div>
      <div className="flex justify-between font-bold text-lg my-4 pt-4 border-t">
        <span>Order total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {CheckoutButton}
    </div>
  );
}
