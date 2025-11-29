import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import ItemList from "../../../components/ui/ItemList";
import toast from "react-hot-toast";
/**
 * A component that displays the current cart's subtotal, estimated costs,
 * and a checkout button.
 */
export default function CartSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, it) => sum + Number(it.price) * it.qty,
    0
  );

  const shipping = subtotal > 0 ? 5.0 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleCheckout = (e) => {
    // Prevent default Link behavior
    e.preventDefault();

    // Find the first item that has an invalid quantity
    const invalidItem = cartItems.find(
      (item) => item.stock !== undefined && item.qty > item.stock
    );

    if (invalidItem) {
      toast.error(
        `Cannot proceed: Quantity for '${invalidItem.name}' (${invalidItem.qty}) exceeds stock (${invalidItem.stock}).`
      );
      return;
    }

    // If all items are valid, proceed to checkout
    navigate("/checkout");
  };

  // The checkout link depends on whether the user is logged in.
  const CheckoutButton = useMemo(() => {
    // Don't show the button if we are already on the checkout page.
    if (location.pathname === "/checkout") {
      return null;
    }
    return (
      <Link
        to={token ? "/checkout" : "/login"}
        state={token ? null : { from: "/cart" }}
        onClick={token ? handleCheckout : undefined}
        className="w-full text-center block bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        {token ? "Proceed to Checkout" : "Login to Continue"}
      </Link>
    );
  }, [token, location.pathname, cartItems]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-12">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

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
