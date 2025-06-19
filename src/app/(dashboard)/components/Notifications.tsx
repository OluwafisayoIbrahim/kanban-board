"use client";
import React, { JSX, useState, useEffect, FC } from "react";
import { Bell, BellOff, X, Clock, AlertTriangle, Calendar } from "lucide-react";
import { Notification } from "@/types/index";

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "deadline",
    title: "Project Review Due Soon",
    message: "Due in 2 hours",
    priority: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    type: "reminder",
    title: "Daily Standup Meeting",
    message: "Starts in 15 minutes",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 3,
    type: "overdue",
    title: "Bug Fix Task Overdue",
    message: "Overdue by 1 day",
    priority: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
];

const getPriorityColor = (priority: Notification["priority"]): string => {
  switch (priority) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

const getNotificationIcon = (type: Notification["type"]): JSX.Element => {
  switch (type) {
    case "deadline":
      return <Clock className="w-4 h-4" />;
    case "reminder":
      return <Calendar className="w-4 h-4" />;
    case "overdue":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

// Utility: Format time ago from ISO string
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date().getTime();
  const date = new Date(timestamp);
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
};

export const Notifications: FC = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notification enabled state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notifications_enabled");
    setIsNotificationsEnabled(saved === "true");
  }, []);

  // Set notifications based on enabled state
  useEffect(() => {
    setNotifications(isNotificationsEnabled ? mockNotifications : []);
    if (!isNotificationsEnabled) {
      setShowNotifications(false);
    }
  }, [isNotificationsEnabled]);

  const toggleNotificationPanel = (): void => {
    if (isNotificationsEnabled) {
      setShowNotifications((prev) => !prev);
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-20 mx-4 relative">
      <div className="relative">
        <button
          onClick={toggleNotificationPanel}
          className={`p-2 rounded-lg transition-colors ${
            isNotificationsEnabled
              ? "hover:bg-gray-800 text-white cursor-pointer"
              : "hover:bg-gray-100 text-gray-400 cursor-pointer"
          }`}
          title={
            isNotificationsEnabled
              ? "View notifications"
              : "Notifications disabled"
          }
        >
          {isNotificationsEnabled ? (
            <Bell className="w-6 h-6" />
          ) : (
            <BellOff className="w-6 h-6" />
          )}
          {isNotificationsEnabled && notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        {showNotifications && isNotificationsEnabled && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${getPriorityColor(n.priority)}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {n.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {n.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTimeAgo(n.timestamp)}
                          </p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            n.priority === "high"
                              ? "bg-red-500"
                              : n.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
