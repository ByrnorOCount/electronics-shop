import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../auth/authSlice";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";

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

  const profileLinks = [
    {
      to: "/settings",
      icon: "security",
      title: "Login & Security",
      description: "Edit login, name, and password.",
      color: "green",
    },
    {
      to: "/orders",
      icon: "orders",
      title: "Your Orders",
      description: "Track, return, or buy things again.",
      color: "blue",
    },
    {
      to: "/wishlist",
      icon: "wishlist",
      title: "Your Wishlist",
      description: "View and manage your saved items.",
      color: "red",
    },
    {
      to: "/notifications",
      icon: "notifications",
      title: "Notifications",
      description: "View your account alerts and messages.",
      color: "yellow",
    },
    {
      to: "/support",
      icon: "support",
      title: "Customer Support",
      description: "Get help with your account or orders.",
      color: "purple",
    },
  ];

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-600">
          Manage your account and view your activity here.
        </p>
      </div>

      {/* Account Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${
                  colorClasses[link.color]
                }`}
              >
                <Icon name={link.icon} />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">{link.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* Sign Out Card */}
        <div
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-start cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <div
            className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${colorClasses.gray}`}
          >
            <Icon name="sign-out" />
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
