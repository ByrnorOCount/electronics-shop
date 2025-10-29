import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * A component that displays the cart's subtotal and a checkout button.
 */
export default function CartSummary() {
  const { items } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);

  const total = items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);

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
      <div className="flex justify-between mb-6">
        <span>Subtotal</span>
        <span className="font-bold">${total.toFixed(2)}</span>
      </div>
      {CheckoutButton}
    </div>
  );
}
