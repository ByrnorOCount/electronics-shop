/**
 * Simple header with logo and primary nav.
 */
import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function Header() {
  const items = useAppSelector((state) => state.cart.items || []);
  const totalQty = items.reduce((s, it) => s + (it.qty || 0), 0);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          ElectroShop
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Catalog</Link>
          <a href="#" className="hover:text-blue-600">Deals</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </nav>
        <div className="flex gap-2">
          <Link to="/login" className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50">
            Sign in
          </Link>
          <Link to="/cart" className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Cart ({totalQty})
          </Link>
        </div>
      </div>
    </header>
  );
}
