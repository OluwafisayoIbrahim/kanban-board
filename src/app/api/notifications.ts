import { getRequest, putRequest, deleteRequest } from '@/lib/api';
import { Notification } from '@/types';

export const getNotifications = async (limit: number = 50, offset: number = 0): Promise<Notification[]> => {
  try {
    const response = await getRequest(`/api/notifications/?limit=${limit}&offset=${offset}`);
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.notifications)) {
      return response.notifications;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch { 
    return [];
  }
};

export const getUnreadCount = async (): Promise<{ unread_count: number }> => {
  try {
    const response = await getRequest('/api/notifications/unread/count');
    
    if (response && typeof response.unread_count === 'number') {
      return response;
    } else if (response && typeof response.count === 'number') {
      return { unread_count: response.count };
    } else {
      return { unread_count: 0 };
    }
  } catch {
    return { unread_count: 0 };
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await putRequest(`/api/notifications/${notificationId}/read`);
  } catch {
    throw new Error('Failed to mark notification as read');
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await putRequest('/api/notifications/read/all');
  } catch {
    throw new Error('Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteRequest(`/api/notifications/${notificationId}`);
  } catch {
    throw new Error('Failed to delete notification');
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  try {
    await deleteRequest('/api/notifications/clear-all');
  } catch {
    throw new Error('Failed to clear all notifications');
  }
};

export const clearAllUserNotifications = async (): Promise<void> => {
  try {
    const notifications = await getNotifications(1000, 0);

    for (const notification of notifications) {
      try {
        await deleteNotification(notification.id);
      } catch {
      }
    }
  } catch {
    throw new Error('Failed to clear all user notifications');
  }
}; 