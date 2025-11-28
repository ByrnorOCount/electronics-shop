import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import ItemList from "../../../components/ui/ItemList";
/**
 * A component that displays the current cart's subtotal, estimated costs,
 * and a checkout button.
 */
export default function CartSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const subtotal = cartItems.reduce(
    (sum, it) => sum + Number(it.price) * it.qty,
    0
  );

  const shipping = subtotal > 0 ? 5.0 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // The checkout link depends on whether the user is logged in.
  const CheckoutButton = useMemo(() => {
    // Don't show the button if we are already on the checkout page.
    if (location.pathname === "/checkout") {
      return null;
    }

    if (token) {
      return (
        <Link
          to="/checkout"
          className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      );
    }
    return (
      <Link
        to="/login"
        state={{ from: "/cart" }}
        className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Login to Continue
      </Link>
    );
  }, [token, location.pathname]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-12">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <ItemList
        items={cartItems}
        showStock={true}
        containerClassName="max-h-60 overflow-y-auto pr-2"
      />

      <div className="space-y-1 text-sm">
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
      <div className="flex justify-between font-bold text-lg mt-3 mb-3 pt-3 border-t">
        <span>Order total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {CheckoutButton}
    </div>
  );
}
