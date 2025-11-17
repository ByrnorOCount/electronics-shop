import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../auth/authSlice";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have been logged out.");
    navigate("/"); // Redirect to home after logout
  };

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email;

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-600">
          Manage your account and view your activity here.
        </p>
      </div>

      {/* Account Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Login & Security Card */}
        <Link
          to="/settings"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Login & Security</h3>
              <p className="text-sm text-gray-600 mt-1">
                Edit login, name, and password.
              </p>
            </div>
          </div>
        </Link>

        {/* Your Orders Card */}
        <Link
          to="/orders"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H21"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Your Orders</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track, return, or buy things again.
              </p>
            </div>
          </div>
        </Link>

        {/* Your Wishlist Card */}
        <Link
          to="/wishlist"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Your Wishlist</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and manage your saved items.
              </p>
            </div>
          </div>
        </Link>

        {/* Notifications Card */}
        <Link
          to="/notifications"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                View your account alerts and messages.
              </p>
            </div>
          </div>
        </Link>

        {/* Customer Support Card */}
        <Link
          to="/support"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">Customer Support</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get help with your account or orders.
              </p>
            </div>
          </div>
        </Link>

        {/* Sign Out Card */}
        <div
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-start cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-lg">Sign Out</h3>
            <p className="text-sm text-gray-600 mt-1">
              End your current session.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Sign Out"
      >
        <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => setIsLogoutModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign Out
          </Button>
        </div>
      </Modal>
    </main>
  );
}
