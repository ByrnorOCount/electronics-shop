import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";
import notificationService from "../notificationService";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  fetchUnreadCount,
  setUnreadCount,
  decrementUnreadCount,
} from "../notificationSlice";
import Icon from "../../../components/ui/Icon";
import Spinner from "../../../components/ui/Spinner";
import { renderFormattedNotificationMessage } from "../../../utils/notificationUtils.jsx";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const {
    data,
    isLoading,
    isError,
    request: fetchNotifications,
  } = useApi(notificationService.getNotifications);
  const { request: markRead } = useApi(notificationService.markAsRead);
  const { request: markAllRead } = useApi(notificationService.markAllAsRead);

  // Fetch unread count when login status changes
  useEffect(() => {
    if (token) {
      dispatch(fetchUnreadCount());
    } else {
      dispatch(setUnreadCount(0)); // Reset on logout
      setNotifications([]);
    }
  }, [token, dispatch]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && token) {
      fetchNotifications(7); // Fetch only the 7 most recent notifications
    }
  };

  useEffect(() => {
    if (data) {
      // The useApi hook returns the full ApiResponse, the notifications are in the `data` property.
      setNotifications(data.data || []);
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
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    dispatch(decrementUnreadCount());
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead();
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    dispatch(setUnreadCount(0));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative flex items-center"
        title="Notifications"
      >
        <Icon
          name="notifications"
          className="h-6 w-6 text-gray-700 hover:text-indigo-600"
        />
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
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center p-4">
                <Spinner size={6} />
              </div>
            )}
            {isError && (
              <p className="p-4 text-center text-red-500">
                Failed to load notifications.
              </p>
            )}
            {!isLoading && notifications.length === 0 && (
              <p className="p-4 text-center text-gray-500">
                You have no notifications.
              </p>
            )}
            {!isLoading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 ${
                    !notification.is_read ? "bg-indigo-50" : ""
                  }`}
                >
                  <Link
                    to={notification.link || "#"}
                    onClick={() => setIsOpen(false)}
                  >
                    <p className="text-sm text-gray-800">
                      {renderFormattedNotificationMessage(notification.message)}
                    </p>
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
          </div>
          <div className="p-2 text-center border-t">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
