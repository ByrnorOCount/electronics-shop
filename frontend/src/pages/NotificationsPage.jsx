import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { notificationService } from '../services/notificationService';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { data, loading, error, request: fetchNotifications } = useApi(notificationService.getNotifications);
  const { request: markAsReadRequest } = useApi(notificationService.markAsRead);
  const { request: markAllAsReadRequest } = useApi(notificationService.markAllAsRead);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load notifications.');
    }
  }, [error]);

  const handleMarkAsRead = async (id) => {
    await markAsReadRequest(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.every(n => n.is_read)) return;
    await markAllAsReadRequest();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read.');
  };

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          disabled={loading || notifications.every(n => n.is_read)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Mark all as read
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading notifications...</p>}
      {!loading && notifications.length === 0 && (
        <div className="text-center bg-white p-12 rounded-lg shadow-sm">
          <p className="text-gray-600">You have no notifications.</p>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map(notification => (
          <Link key={notification.id} to={notification.link || '#'} className={`block p-4 rounded-lg shadow-sm transition-colors ${notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'}`}>
            <p className="text-sm text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
