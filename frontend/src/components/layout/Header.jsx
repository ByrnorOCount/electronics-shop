/**
 * Simple header with logo and primary nav.
 */
import React from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "../../features/notifications/components/NotificationDropdown";
import { useAppSelector } from "../../store/hooks";
import Icon from "../ui/Icon";

export default function Header() {
  const items = useAppSelector((state) => state.cart.items || []);
  const { user, token } = useAppSelector((state) => state.auth);
  const totalQty = items.reduce((s, it) => s + (it.qty || 0), 0);

  const isStaffOrAdmin = user?.role === "staff" || user?.role === "admin";

  return (
    <header className="sticky top-0 bg-amber-200 shadow-sm z-50">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center text-xl font-bold text-indigo-600"
        >
          <img
            src="/logo.svg"
            alt="ElectroShop Logo"
            className="h-8 w-auto mr-1"
          />
          ElectroShop
        </Link>
        <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/products" className="hover:text-indigo-600">
            Catalog
          </Link>
          <Link to="/products?filter=deals" className="hover:text-indigo-600">
            Deals
          </Link>
          <Link to="/support" className="hover:text-indigo-600">
            Support
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Cart always appears for guests */}
          <Link
            to="/cart"
            className="relative flex items-center"
            title="Shopping Cart"
          >
            <Icon
              name="cart"
              className="h-6 w-6 text-gray-700 hover:text-indigo-600"
            />
            {totalQty > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>
          {token ? (
            <>
              <NotificationDropdown />
              <Link
                to="/wishlist"
                className="relative flex items-center"
                title="My Wishlist"
              >
                <Icon
                  name="wishlist"
                  className="h-6 w-6 text-gray-700 hover:text-indigo-600"
                />
              </Link>
              <Link
                to="/orders"
                className="relative flex items-center"
                title="Order History"
              >
                <Icon
                  name="orders"
                  className="h-6 w-6 text-gray-700 hover:text-indigo-600"
                />
              </Link>
              {isStaffOrAdmin && (
                <Link to="/staff" title="Staff Panel">
                  <Icon
                    name="staff-panel"
                    className="h-6 w-6 text-gray-700 hover:text-indigo-600"
                  />
                </Link>
              )}
              <Link
                to="/profile"
                title="My Account"
                className="relative flex items-center"
              >
                <Icon
                  name="user-account"
                  className="h-6 w-6 text-gray-700 hover:text-indigo-600"
                />
              </Link>
            </>
          ) : (
            <Link to="/login" title="Sign In" className="flex items-center">
              <Icon
                name="sign-in"
                className="h-6 w-6 text-gray-700 hover:text-indigo-600"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
