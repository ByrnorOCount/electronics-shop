/**
 * Simple header with logo and primary nav.
 */
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="#" className="text-xl font-bold text-blue-600">
          ElectroShop
        </a>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Catalog</a>
          <a href="#" className="hover:text-blue-600">Deals</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </nav>
        <div className="flex gap-2">
          <a href="#" className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50">
            Sign in
          </a>
          <a href="#" className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Cart (0)
          </a>
        </div>
      </div>
    </header>
  );
}
