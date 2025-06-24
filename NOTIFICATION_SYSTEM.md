# Notification System Documentation

## Overview
The notification system uses a backend-based approach for better reliability, consistency, and scalability. All notifications are created and managed on the backend and fetched by the frontend via API calls.

## Architecture

### Backend Components
1. **Notification Endpoints** - FastAPI routes for notification CRUD operations
2. **Notification Schemas** - Pydantic models for notification data validation
3. **Database Integration** - CRUD operations for notification persistence
4. **Friend Request Integration** - Automatic notification creation during friend request actions
5. **Timestamp Handling** - Robust relative time calculation with future date handling

### Frontend Components
1. **`useNotificationStore`** - Zustand store for notification state management (fetches from backend)
2. **`Notifications`** - Header dropdown component for displaying notifications
3. **`NotificationSettingsPage`** - Settings page for notification preferences
4. **`notifications.ts`** - API service for backend communication
5. **`formatNotificationTime`** - Centralized utility for timestamp formatting

### Notification Types
- `friend_request` - Friend request notifications
- `friend_accept` - Friend request accepted notifications
- `friend_decline` - Friend request declined notifications
- `deadline` - Task deadline notifications
- `reminder` - Reminder notifications
- `overdue` - Overdue task notifications
- `task_assigned` - Task assignment notifications
- `task_completed` - Task completion notifications

## Backend Implementation

### Notification Endpoints
```python
# GET /notifications/ - Get user notifications
# GET /notifications/unread/count - Get unread count
# PUT /notifications/{id}/read - Mark notification as read
# PUT /notifications/read/all - Mark all as read
# DELETE /notifications/{id} - Delete notification
```

### Improved Timestamp Handling
The backend now provides robust timestamp formatting:

```python
def get_relative_time(dt: datetime) -> str:
    """Convert datetime to relative time string (e.g., 'now', '1m', '2h', '3d')"""
    try:

        if dt.tzinfo is None:

            dt = dt.replace(tzinfo=dt.timezone.utc)
        
        now = datetime.now(dt.timezone.utc)
        diff = now - dt
        
        if diff.total_seconds() < 0:
            return "now"
        
        total_seconds = int(diff.total_seconds())
        
        if total_seconds < 60:
            return "now"
        elif total_seconds < 3600:
            minutes = total_seconds // 60
            return f"{minutes}m"
        elif total_seconds < 86400:
            hours = total_seconds // 3600
            return f"{hours}h"
        elif total_seconds < 604800:
            days = total_seconds // 86400
            return f"{days}d"
        elif total_seconds < 2592000:
            weeks = total_seconds // 604800
            return f"{weeks}w"
        elif total_seconds < 31536000:
            months = total_seconds // 2592000
            return f"{months}mo"
        else:
            years = total_seconds // 31536000
            return f"{years}y"
    except Exception as e:
        print(f"Error in get_relative_time: {e}")
        return "now"  # Return "now" instead of "Unknown"
```

### Friend Request Integration
The backend automatically creates notifications during friend request actions:

1. **Send Friend Request**:
   - Creates notification for recipient: "{username} sent you a friend request"

2. **Accept Friend Request**:
   - Creates notification for sender: "{username} accepted your friend request"

3. **Decline Friend Request**:
   - Creates notification for sender: "{username} declined your friend request"

## Frontend Implementation

### Notification Store
```typescript
const {
  notifications,
  unreadCount,
  isLoading,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification
} = useNotificationStore();
```

### Centralized Timestamp Formatting
```typescript
import { formatNotificationTime } from '@/lib/utils';

const timeAgo = formatNotificationTime(notification);
```

### API Service
```typescript
const notifications = await getNotifications();

await markNotificationAsRead(notificationId);

const { unread_count } = await getUnreadCount();
```

## Key Features

### Backend-Driven Notifications
- All notifications are created and stored on the backend
- Frontend fetches notifications via API calls
- Notifications persist across sessions and devices
- Real-time delivery possible via WebSocket

### Robust Timestamp Handling
- Backend handles future dates gracefully (returns "now")
- Consistent relative time format across the application
- Fallback to frontend calculation if backend data unavailable
- Proper timezone handling with UTC

### Automatic Notification Creation
- Friend request actions automatically create appropriate notifications
- No manual notification creation needed on frontend
- Consistent notification delivery for all users

### Reliable State Management
- Notifications are fetched from backend on component mount
- Unread count is always accurate
- Loading states for better UX

### Settings Management
- Users can enable/disable notifications globally
- Individual notification types can be configured
- Settings are persisted in frontend store

## File Structure
```
Backend:
├── routers/
│   ├── notifications.py          # Notification endpoints
│   └── friends.py               # Updated friend endpoints with notifications
├── schemas/
│   ├── notification.py          # Notification Pydantic models
│   └── friend.py               # Friend request schemas
└── db/
    └── crud.py                 # Database operations with improved timestamp handling

Frontend:
├── store/
│   └── notification-store.ts    # Backend-based notification store
├── lib/
│   └── utils.ts                # Centralized timestamp formatting utility
├── app/
│   ├── api/
│   │   ├── notifications.ts     # Notification API service
│   │   └── friends.ts          # Updated friends API service
│   ├── (dashboard)/
│   │   ├── components/
│   │   │   └── Notifications.tsx # Header notification dropdown
│   │   └── dashboard/
│   │       └── notifications/
│   │           └── page.tsx     # Notifications page
│   └── (settings)/
│       └── settings/
│           └── notification/
│               └── page.tsx     # Notification settings
└── types/
    └── index.ts                 # Notification type definitions
```

## Best Practices

1. **Backend Responsibility**: All notification creation happens on the backend
2. **API-First**: Frontend communicates with backend via REST API
3. **Error Handling**: Proper error handling for API calls
4. **Loading States**: Show loading indicators during API calls
5. **Caching**: Frontend caches notifications but refreshes when needed
6. **Real-time**: Backend can push notifications via WebSocket when needed
7. **Timestamp Consistency**: Use centralized utility for timestamp formatting

## Notification Flow

1. **User Action**: User performs an action (e.g., sends friend request)
2. **Backend Processing**: Backend processes the action and creates notifications
3. **Timestamp Formatting**: Backend calculates relative time with future date handling
4. **Frontend Fetch**: Frontend fetches updated notifications via API
5. **UI Update**: Notification UI updates using centralized timestamp formatting

## Backend Database Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'low',
    action_url VARCHAR(500),
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Data Structure

```typescript
interface Notification {
  id: string;
  user_id: string;
  type: "friend_request" | "friend_accept" | "friend_decline" | "deadline" | "reminder" | "overdue" | "task_assigned" | "task_completed";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  action_url?: string;
  metadata?: {
    senderId?: string;
    receiverId?: string;
    taskId?: string;
    friendRequestId?: string;
    senderUsername?: string;
    accepterUsername?: string;
    declinerUsername?: string;
    [key: string]: any;
  };
  is_read: boolean;
  created_at: string;
  created_at_formatted?: string;  
  created_at_relative?: string;   
  updated_at?: string;
}
```

## Timestamp Format Examples

### Backend Format
- `"now"` - Less than 1 minute ago
- `"1m"` - 1 minute ago
- `"2h"` - 2 hours ago
- `"3d"` - 3 days ago
- `"1w"` - 1 week ago
- `"2mo"` - 2 months ago
- `"1y"` - 1 year ago

### Frontend Display
- `"Just now"` - Less than 1 minute ago
- `"1m ago"` - 1 minute ago
- `"2h ago"` - 2 hours ago
- `"3d ago"` - 3 days ago
- `"1w ago"` - 1 week ago
- `"2mo ago"` - 2 months ago
- `"1y ago"` - 1 year ago

## Future Enhancements

- Real-time notifications via WebSocket
- Email notifications
- Push notifications for mobile
- Notification sound effects
- Custom notification templates
- Notification history and archiving 
- Notification preferences per user
- Bulk notification operations 