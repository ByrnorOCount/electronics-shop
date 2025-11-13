import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useApi } from '../../hooks/useApi';
import userService from './userService.js';
import { setUser } from '../auth/authSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
 
export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // --- Profile Update State & Logic ---
  const { loading: profileLoading, error: profileError, request: updateProfile } = useApi(userService.updateUserProfile);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  // --- Password Change State & Logic ---
  const { register, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm, watch } = useForm();
  const { loading: passwordLoading, error: passwordError, request: changePassword } = useApi(userService.changePassword);

  // State for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile(formData);
      dispatch(setUser(response.user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  const onPasswordFormSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  if (!user) {
    return <main className="flex-grow text-center py-12">Loading user data...</main>;
  }

  return (
    <main className="flex-grow max-w-2xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold mb-8">Login & Security</h1>

      {/* Login & Security Section */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 mb-6">Manage your personal information and password.</p>

        {/* Profile Information Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6 border-b pb-8 mb-8">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              {profileError && <p className="text-sm text-red-600">{profileError.message}</p>}
            </div>
            <button type="submit" disabled={profileLoading} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit(onPasswordFormSubmit)} className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <input type="hidden" autoComplete="username" value={user?.email || ''} readOnly />

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {passwordErrors.currentPassword && <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword.message}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must include uppercase, lowercase, number, and special character.'
                  }
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {passwordErrors.newPassword && <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"

                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: value => value === watch('newPassword') || 'The passwords do not match'
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
            {passwordErrors.confirmPassword && <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              {passwordError && <p className="text-sm text-red-600">{passwordError.message}</p>}
            </div>
            <button type="submit" disabled={passwordLoading} className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {passwordLoading ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// Helper components for the icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.543-5.118m5.458-1.882A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.05 10.05 0 01-1.882 3.543M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
  </svg>
);
