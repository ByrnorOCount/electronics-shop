import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to home after logout
  };

  const userName = user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email;

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-gray-600">Manage your account and view your activity here.</p>
      </div>

      {/* Account Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/orders" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">Your Orders</h3>
          <p className="text-sm text-gray-600 mt-1">Track, return, or buy things again.</p>
        </Link>
        <Link to="/settings" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">Login & Security</h3>
          <p className="text-sm text-gray-600 mt-1">Edit login, name, and password.</p>
        </Link>
        <Link to="/wishlist" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">Your Wishlist</h3>
          <p className="text-sm text-gray-600 mt-1">View and manage your saved items.</p>
        </Link>
        <Link to="/notifications" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">View your account alerts and messages.</p>
        </Link>
        <Link to="/support" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">Customer Support</h3>
          <p className="text-sm text-gray-600 mt-1">Get help with your account or orders.</p>
        </Link>
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
