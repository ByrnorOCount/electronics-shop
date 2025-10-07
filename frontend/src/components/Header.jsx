/**
 * Simple header with logo and primary nav.
 */
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 bg-amber-100 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          ElectroShop
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Catalog</Link>
          <Link to="/products?filter=deals" className="hover:text-indigo-600">Deals</Link>
          <Link to="/support" className="hover:text-indigo-600">Support</Link>
        </nav>
        <div className="flex gap-2">
          <Link to="/login" className="px-3 py-1 rounded-md border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50">
            Sign in
          </Link>
          <Link to="/cart" className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Cart (0)
          </Link>
        </div>
      </div>
    </header>
  );
}
