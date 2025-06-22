import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Notification } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatNotificationTime(notification: Notification, timestampUpdate?: number): string {
  try {
    // Use timestampUpdate to create a dynamic "now" time that updates
    const now = timestampUpdate ? new Date(timestampUpdate) : new Date();
    
    if (notification.created_at_relative && notification.created_at_relative !== 'Unknown') {
      
      const backendTime = notification.created_at_relative;
      
      
      if (backendTime === 'now') {
        return 'Just now';
      } else if (backendTime.endsWith('m')) {
        return `${backendTime} ago`;
      } else if (backendTime.endsWith('h')) {
        return `${backendTime} ago`;
      } else if (backendTime.endsWith('d')) {
        return `${backendTime} ago`;
      } else if (backendTime.endsWith('w')) {
        return `${backendTime} ago`;
      } else if (backendTime.endsWith('mo')) {
        return `${backendTime} ago`;
      } else if (backendTime.endsWith('y')) {
        return `${backendTime} ago`;
      } else {
        return backendTime; 
      }
    }
    
    
    
    if (!notification.created_at) {
      return 'Unknown time';
    }
    
    
    const notificationDate = new Date(notification.created_at);
    
    
    if (isNaN(notificationDate.getTime())) {
      return 'Invalid time';
    }
    
    
    
    if (notificationDate > now) {
      
      
      if (notificationDate.getFullYear() === 2025) {
        const correctedDate = new Date(notificationDate);
        correctedDate.setFullYear(2024);
        
        const correctedDiffMs = now.getTime() - correctedDate.getTime();
        
        if (correctedDiffMs < 0) {
          
          return 'Just now';
        }
        
        
        const seconds = Math.floor(correctedDiffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        const result = days > 0 ? `${days}d ago` :
                       hours > 0 ? `${hours}h ago` :
                       minutes > 0 ? `${minutes}m ago` :
                       seconds > 30 ? `${seconds}s ago` : 'Just now';

        return result;
      }
      
      
      return 'Just now';
    }
    
    const diffMs = now.getTime() - notificationDate.getTime();
    
        
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const result = days > 0 ? `${days}d ago` :
                   hours > 0 ? `${hours}h ago` :
                   minutes > 0 ? `${minutes}m ago` :
                   seconds > 30 ? `${seconds}s ago` : 'Just now';
    
    return result;
  } catch (error) {
    console.error('Error formatting notification time:', error);
    return 'Unknown time';
  }
}
