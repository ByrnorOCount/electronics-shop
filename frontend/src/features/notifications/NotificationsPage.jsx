import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { notificationService } from "../../api";
import toast from "react-hot-toast";
import { renderFormattedNotificationMessage } from "../../utils/notificationUtils.jsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { decrementUnreadCount, setUnreadCount } from "./notificationSlice.js";

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    isError,
    request: fetchNotifications,
  } = useApi(notificationService.getNotifications);
  const { request: markAsReadRequest } = useApi(notificationService.markAsRead);
  const { request: markAllAsReadRequest } = useApi(
    notificationService.markAllAsRead
  );

  const [notifications, setNotifications] = useState([]);
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    fetchNotifications(); // Re-fetch notifications whenever the global unreadCount changes
  }, [fetchNotifications, unreadCount]);

  useEffect(() => {
    if (data) {
      // The useApi hook returns the full ApiResponse, the notifications are in the `data` property.
      setNotifications(data.data || []);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notifications.");
    }
  }, [isError]);

  const handleMarkAsRead = async (id) => {
    const notification = notifications.find((n) => n.id === id);
    // Only perform action if the notification is currently unread
    if (notification && !notification.is_read) {
      await markAsReadRequest(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      dispatch(decrementUnreadCount());
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.every((n) => n.is_read)) return;
    try {
      await markAllAsReadRequest();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      dispatch(setUnreadCount(0));
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark all notifications as read.");
    }
  };

  return (
    <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          disabled={isLoading || notifications.every((n) => n.is_read)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Mark all as read
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-500">Loading notifications...</p>
      )}
      {!isLoading && notifications.length === 0 && (
        <div className="text-center bg-white p-12 rounded-lg shadow-sm">
          <p className="text-gray-600">You have no notifications.</p>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`block p-4 rounded-lg shadow-sm transition-colors ${
              notification.is_read
                ? "bg-white hover:bg-gray-50"
                : "bg-indigo-50 hover:bg-indigo-100"
            }`}
          >
            <Link to={notification.link || "#"} className="block">
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
                className="text-xs text-indigo-500 hover:underline mt-2 font-medium"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
