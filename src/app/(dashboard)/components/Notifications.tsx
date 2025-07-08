"use client";
import React, { JSX, useState, useEffect, FC } from "react";
import { Bell, BellOff, X, Clock, AlertTriangle, Calendar, UserPlus, Users, Check, X as XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification-store";
import { Notification } from "@/types/index";
import { formatNotificationTime } from '@/lib/utils';
import { Button } from "@/components/ui/button";

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
    case "friend_request":
      return <UserPlus className="w-4 h-4" />;
    case "friend_accept":
      return <Check className="w-4 h-4" />;
    case "friend_decline":
      return <XIcon className="w-4 h-4" />;
    case "friend_removed_by_other":
      return <Users className="w-4 h-4" />;
    case "friend_removed_by_you":
      return <Users className="w-4 h-4" />;
    case "deadline":
      return <Clock className="w-4 h-4" />;
    case "reminder":
      return <Calendar className="w-4 h-4" />;
    case "overdue":
      return <AlertTriangle className="w-4 h-4" />;
    case "task_assigned":
      return <Users className="w-4 h-4" />;
    case "task_completed":
      return <Check className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export const Notifications: FC = () => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [timestampUpdate, setTimestampUpdate] = useState(0); 
  
  const {
    notifications,
    settings,
    unreadCount,
    isLoading,
    deletingNotificationId,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setHasNewNotifications,
  } = useNotificationStore();

  
  useEffect(() => {
    if (notifications.length === 0) {
      fetchNotifications();
    }
    fetchUnreadCount();
  }, [notifications.length, fetchNotifications, fetchUnreadCount]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampUpdate(prev => {
        const newValue = prev + 1;
        return newValue;
      });
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const toggleNotificationPanel = (): void => {
    if (settings.enabled) {
      setShowNotifications((prev) => !prev);
      if (!showNotifications) {
        setHasNewNotifications(false);
        fetchNotifications();
        fetchUnreadCount();
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    
    await markAsRead(notification.id);
    
    if (notification.action_url) {
      router.push(notification.action_url);
    }
    
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRemoveNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await removeNotification(notificationId);
  };

  return (
    <div className="hidden md:flex items-center space-x-20 mx-4 relative">
      <div className="relative">
        <Button
          onClick={toggleNotificationPanel}
          variant="ghost"
          size="icon"
          className={`p-2 rounded-lg transition-colors ${settings.enabled ? "hover:bg-gray-400 text-white cursor-pointer" : "hover:bg-gray-100 text-gray-400 cursor-pointer"}`}
          title={settings.enabled ? "View notifications" : "Notifications disabled"}
        >
          {settings.enabled ? (
            <Bell className="w-6 h-6" />
          ) : (
            <BellOff className="w-6 h-6" />
          )}
          {settings.enabled && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
        {showNotifications && settings.enabled && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Button
                  onClick={() => setShowNotifications(false)}
                  variant="ghost"
                  size="icon"
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification, timestampUpdate)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              notification.priority === "high"
                                ? "bg-red-500"
                                : notification.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          />
                          <Button
                            onClick={(e) => handleRemoveNotification(e, notification.id)}
                            disabled={deletingNotificationId === notification.id}
                            variant="ghost"
                            size="icon"
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingNotificationId === notification.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                            ) : (
                              <X className="w-3 h-3 text-gray-400" />
                            )}
                          </Button>
                        </div>
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
                  <Button 
                    onClick={handleMarkAllAsRead}
                    variant="link"
                    size="sm"
                    className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Mark all as read
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
