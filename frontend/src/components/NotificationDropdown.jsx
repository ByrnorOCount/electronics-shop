import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { notificationService } from '../services/notificationService';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const { data, error, loading, request: fetchNotifications } = useApi(notificationService.getNotifications);
  const { request: markRead } = useApi(notificationService.markAsRead);
  const { request: markAllRead } = useApi(notificationService.markAllAsRead);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(7); // Fetch only the 7 most recent notifications
    }
  };

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    await markRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="relative flex items-center" title="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400">
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
            {error && <p className="p-4 text-center text-red-500">Failed to load notifications.</p>}
            {!loading && notifications.length === 0 && (
              <p className="p-4 text-center text-gray-500">You have no notifications.</p>
            )}
            {notifications.map(notification => (
              <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.is_read ? 'bg-indigo-50' : ''}`}>
                <Link to={notification.link || '#'} onClick={() => setIsOpen(false)}>
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </Link>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs text-indigo-500 hover:underline mt-1"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
            <div className="p-2 text-center border-t">
              <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
