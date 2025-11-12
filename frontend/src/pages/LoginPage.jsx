// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import FacebookLoginButton from '../components/auth/FacebookLoginButton';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const registrationSuccess = new URLSearchParams(location.search).get('status') === 'registered';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login form using EMAIL/PASSWORD (remains the same)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/login', formData);
      const { token, user } = response.data;
      dispatch(setCredentials({ token, user }));
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {registrationSuccess && (
          <p className="text-green-600 bg-green-100 p-3 rounded-md text-center mb-4">
            Registration successful! Please log in.
          </p>
        )}

        {/* Original EMAIL/PASS login form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" autoComplete="email" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input type="password" name="password" onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 2. ADD THE GOOGLE BUTTON HERE */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <GoogleLoginButton />
        <FacebookLoginButton />

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;