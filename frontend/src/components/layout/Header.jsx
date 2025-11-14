/**
 * Simple header with logo and primary nav.
 */
import React from 'react';
import { Link } from "react-router-dom";
import NotificationDropdown from '../../features/notification/components/NotificationDropdown';
import { useAppSelector } from '../../store/hooks';

export default function Header() {
  const items = useAppSelector((state) => state.cart.items || []);
  const { user, token } = useAppSelector((state) => state.auth);
  const totalQty = items.reduce((s, it) => s + (it.qty || 0), 0);

  return (
    <header className="sticky top-0 bg-amber-200 shadow-sm z-50">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center text-xl font-bold text-indigo-600">
          <img src="/logo.svg" alt="ElectroShop Logo" className="h-8 w-auto mr-1" />
          ElectroShop
        </Link>
        <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Catalog</Link>
          <Link to="/products?filter=deals" className="hover:text-indigo-600">Deals</Link>
          <Link to="/support" className="hover:text-indigo-600">Support</Link>
        </nav>
        <div className="flex items-center gap-4">
          {token ? (
            <Link to="/profile" title="My Account" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          ) : (
            <Link to="/login" title="Sign In" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </Link>
          )}

          {token && (
            <>
              <NotificationDropdown />
              <Link to="/wishlist" className="relative flex items-center" title="My Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
              </Link>
            </>
          )}
          <Link to="/cart" className="relative flex items-center" title="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalQty > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
