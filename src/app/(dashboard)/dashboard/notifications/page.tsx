'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, UserPlus, Users, Check, X as XIcon, Clock, AlertTriangle, Calendar, Trash2 } from 'lucide-react';
import { useNotificationStore } from '@/store/notification-store';
import { Notification } from '@/types';
import { formatNotificationTime } from '@/lib/utils';
import { toast } from 'sonner';
import { clearAllUserNotifications } from '@/app/api/notifications';

const getPriorityColor = (priority: Notification["priority"]): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "friend_request":
      return <UserPlus className="w-5 h-5" />;
    case "friend_accept":
      return <Check className="w-5 h-5" />;
    case "friend_decline":
      return <XIcon className="w-5 h-5" />;
    case "friend_removed_by_other":
      return <Users className="w-5 h-5" />;
    case "friend_removed_by_you":
      return <Users className="w-5 h-5" />;
    case "deadline":
      return <Clock className="w-5 h-5" />;
    case "reminder":
      return <Calendar className="w-5 h-5" />;
    case "overdue":
      return <AlertTriangle className="w-5 h-5" />;
    case "task_assigned":
      return <Users className="w-5 h-5" />;
    case "task_completed":
      return <Check className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const NotificationsPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<Notification['type'] | 'all'>('all');
  const [timestampUpdate, setTimestampUpdate] = useState(0); 
  
  const {
    notifications,
    unreadCount,
    deletingNotificationId,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestampUpdate(prev => prev + 1);
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'unread' && !notification.is_read) ||
      (filter === 'read' && notification.is_read);
    
    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesReadFilter && matchesTypeFilter;
  });

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRemoveNotification = (notificationId: string) => {
    removeNotification(notificationId);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications? This will remove all old notifications with incorrect timestamps.')) {
      try {
        await clearAllUserNotifications();
        toast.success('All notifications cleared');
        fetchNotifications();
        fetchUnreadCount();
      } catch {
        toast.error('Failed to clear notifications');
      }
    }
  };

  const handleRefresh = async () => {
    fetchNotifications();
    fetchUnreadCount();
    toast.success('Notifications refreshed');
  };

  const handleTestNotification = async () => {
    try {
      const testNotification = {
        id: 'test-' + Date.now(),
        user_id: 'test-user',
        type: 'friend_request' as const,
        title: 'Test Notification',
        message: 'This is a test notification created at ' + new Date().toISOString(),
        priority: 'low' as const,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const currentNotifications = notifications;
      const updatedNotifications = [testNotification, ...currentNotifications];
      
      useNotificationStore.setState({ notifications: updatedNotifications });
      
      toast.success('Test notification created with current time');
    } catch {
      toast.error('Failed to create test notification');
    }
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types', icon: Bell },
    { value: 'friend_request', label: 'Friend Requests', icon: UserPlus },
    { value: 'friend_accept', label: 'Friend Accepts', icon: Check },
    { value: 'friend_decline', label: 'Friend Declines', icon: XIcon },
    { value: 'friend_removed_by_other', label: 'Friend Removed You', icon: Users },
    { value: 'friend_removed_by_you', label: 'You Removed Friend', icon: Users },
    { value: 'deadline', label: 'Deadlines', icon: Clock },
    { value: 'reminder', label: 'Reminders', icon: Calendar },
    { value: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { value: 'task_assigned', label: 'Task Assigned', icon: Users },
    { value: 'task_completed', label: 'Task Completed', icon: Check },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-blue-100 mt-1">Stay updated with your latest activities</p>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm opacity-90">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm opacity-90">Unread</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Notifications</h2>
              <p className="text-sm text-gray-500">
                Manage your notifications 
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Live updates every 10s
                </span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleTestNotification}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Test Notification
              </button>
            </div>
          </div>

          {notifications.length > 0 && notifications.some(n => new Date(n.created_at).getFullYear() === 2025) && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <h3 className="font-medium text-yellow-900">Old Notifications Detected</h3>
                  <p className="text-sm text-yellow-800">
                    Some notifications have incorrect timestamps from when your system time was set to 2025. 
                    Click &quot;Clear All&quot; to remove them and create fresh notifications with correct timestamps.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as Notification['type'] | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {notificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 text-sm font-medium  cursor-pointer text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filters'}
              </h3>
              <p className="text-gray-500">
                {notifications.length === 0 
                  ? 'You\'ll see notifications here when you receive friend requests, task updates, and more.'
                  : 'Try adjusting your filters to see more notifications.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {formatNotificationTime(notification, timestampUpdate)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveNotification(notification.id);
                            }}
                            disabled={deletingNotificationId === notification.id}
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingNotificationId === notification.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                            ) : (
                              <Trash2 className="w-3 h-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.action_url && (
                        <p className="text-xs text-blue-600 mt-2">
                          Click to view details →
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.priority === "high"
                          ? "bg-red-500"
                          : notification.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 