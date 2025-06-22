import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationSettings, NotificationState } from '@/types';
import { 
  getNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '@/app/api/notifications';

const defaultSettings: NotificationSettings = {
  enabled: true,
  friendRequests: true,
  taskUpdates: true,
  deadlines: true,
  reminders: true,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      settings: defaultSettings,
      unreadCount: 0,
      hasNewNotifications: false,
      isLoading: false,
      deletingNotificationId: null,

      fetchNotifications: async () => {
        set({ isLoading: true });
        try {
          const notifications = await getNotifications();
          set({ notifications, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      fetchUnreadCount: async () => {
        try {
          const { unread_count } = await getUnreadCount();
          set({ unreadCount: unread_count });
        } catch {
          set({ unreadCount: 0 });
        }
      },

      markAsRead: async (notificationId) => {
        try {
          await markNotificationAsRead(notificationId);
          set((state) => {
            const updatedNotifications = state.notifications.map(notification =>
              notification.id === notificationId 
                ? { ...notification, is_read: true }
                : notification
            );
            const newUnreadCount = updatedNotifications.filter(n => !n.is_read).length;
            
            return {
              notifications: updatedNotifications,
              unreadCount: newUnreadCount,
            };
          });
        } catch {
          set({ isLoading: false });
        }
      },

      markAllAsRead: async () => {
        try {
          await markAllNotificationsAsRead();
          
          
          await get().fetchNotifications();
          
          await get().fetchUnreadCount();
          
        } catch {
          set({ isLoading: false });
        }
      },

      removeNotification: async (notificationId) => {
        try {
          set({ deletingNotificationId: notificationId }); 
          await deleteNotification(notificationId);
          set((state) => {
            const filteredNotifications = state.notifications.filter(n => n.id !== notificationId);
            const newUnreadCount = filteredNotifications.filter(n => !n.is_read).length;
            
            return {
              notifications: filteredNotifications,
              unreadCount: newUnreadCount,
              deletingNotificationId: null, 
            };
          });
            } catch {
          set({ deletingNotificationId: null }); 
        }
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
          hasNewNotifications: false,
        });
      },

      resetNotificationStore: () => {
        set({
          notifications: [],
          settings: defaultSettings,
          unreadCount: 0,
          hasNewNotifications: false,
          isLoading: false,
          deletingNotificationId: null,
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setHasNewNotifications: (hasNew) => {
        set({ hasNewNotifications: hasNew });
      },

      resetUnreadCount: () => {
        set({ hasNewNotifications: false });
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);