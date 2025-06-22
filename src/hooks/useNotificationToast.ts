'use client';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useNotificationStore } from '@/store/notification-store';

export const useNotificationToast = () => {
  const { unreadCount, hasNewNotifications, resetUnreadCount } = useNotificationStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Only show toast on initial login if user has new notifications and hasn't seen the toast yet
    if (hasNewNotifications && unreadCount > 0 && !hasShownToast.current) {
      toast.success(`You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}!`, {
        description: 'Click the bell icon to view them',
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            // This will be handled by the notification component
            // We could potentially trigger the notification panel to open
          },
        },
      });
      
      // Mark that we've shown the toast for this session
      hasShownToast.current = true;
      
      // Reset the flag so it doesn't show again until new notifications arrive
      resetUnreadCount();
    }
  }, [hasNewNotifications, unreadCount, resetUnreadCount]);

  return null;
}; 