# Notification System Documentation

## Overview
The notification system is designed to ensure users reliably receive updates about relevant events. It leverages a backend-based approach, meaning all notifications are created, stored, and managed on the server rather than locally in the browser(s). This centralization increases reliability—notifications persist even if a user changes devices or browsers—and supports system scalability as more users or types of notifications are added.

## Architecture

### Backend Components

1. **Notification Endpoints**  
   These are API routes (using FastAPI) that allow the frontend to interact with notifications. CRUD stands for Create, Read, Update, Delete, so endpoints exist for creating new notifications, retrieving existing ones, updating their status (like marking as read), and deleting them.

2. **Notification Schemas**  
   Schemas, built with Pydantic, define the structure and validation rules for notification data. This ensures that data sent to and from the backend is consistent and meets expectations.

3. **Database Integration**  
   Notifications are stored in a database, not just held in memory. CRUD operations here ensure notifications can be saved, updated, retrieved, and deleted efficiently. This persistence means notifications survive server restarts and are available across user sessions.

4. **Friend Request Integration**  
   Whenever users interact with friend requests (send, accept, decline), notifications are automatically generated. This automation guarantees users are informed about changes in their social connections without manual intervention.

5. **Timestamp Handling**  
   The backend calculates how long ago a notification occurred (e.g., "2h" for two hours ago) and handles future dates gracefully. This way, notifications are always displayed with relevant time information, enhancing user understanding.

### Frontend Components

1. **`useNotificationStore`**  
   Using Zustand (a lightweight state management library), notification data is stored in a centralized place. This store fetches notifications from the backend and keeps track of unread counts and loading states, making it easier to manage notification-related UI updates.

2. **`Notifications`**  
   This is a dropdown component in the header for displaying notifications. It provides a quick overview of recent events the user should know about.

3. **`NotificationSettingsPage`**  
   Users can adjust their notification preferences here, choosing which types of notifications they want to receive or silence.

4. **`notifications.ts`**  
   This service file handles communication with the backend API, encapsulating network requests related to notifications so they can be reused throughout the frontend code.

5. **`formatNotificationTime`**  
   A utility function that takes a notification’s timestamp and formats it for the UI. This results in consistent, readable time indications like "2h ago" or "Just now" throughout the application.

### Notification Types

- `friend_request`: Alert when someone sends a friend request.
- `friend_accept`: Alert when a friend request you sent is accepted.
- `friend_decline`: Alert when a friend request you sent is declined.
- `deadline`: Alert for approaching task deadlines.
- `reminder`: Alert for task reminders you’ve set.
- `overdue`: Alert for tasks that are overdue.
- `task_assigned`: Alert when you are assigned a new task.
- `task_completed`: Alert when a task is marked as completed.

## Backend Implementation

### Notification Endpoints

```python
# GET /notifications/ - Get user notifications
# GET /notifications/unread/count - Get unread count
# PUT /notifications/{id}/read - Mark notification as read
# PUT /notifications/read/all - Mark all as read
# DELETE /notifications/{id} - Delete notification
```
**Explanation:**  
- `GET /notifications/` retrieves all notifications for the user.
- `GET /notifications/unread/count` provides a count of unread notifications, letting the frontend display an unread badge.
- `PUT /notifications/{id}/read` and `PUT /notifications/read/all` update the notification(s) status to read, helping users keep track of what they’ve seen.
- `DELETE /notifications/{id}` allows users to remove notifications they no longer need.

### Improved Timestamp Handling

The backend calculates the relative time between now and when the notification occurred, using UTC for consistency. If a notification is scheduled in the future, it returns "now" to avoid confusing the user.

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
**Explanation:**  
This function ensures that all timestamps are shown in a human-readable, relative format, enhancing user experience and making it easier to interpret event timing.

### Friend Request Integration

Notifications are automatically triggered by friend request actions, ensuring users are always informed about the status of their social interactions.

1. **Send Friend Request:**  
   Recipient gets a notification: "{username} sent you a friend request"

2. **Accept Friend Request:**  
   Sender gets a notification: "{username} accepted your friend request"

3. **Decline Friend Request:**  
   Sender gets a notification: "{username} declined your friend request"

**Explanation:**  
This automation removes the need for manual notification creation and guarantees consistency.

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
**Explanation:**  
The store manages the notification lifecycle: fetching them, marking as read, removing them, and tracking how many are unread. It also exposes loading states for better UI responsiveness.

### Centralized Timestamp Formatting

```typescript
import { formatNotificationTime } from '@/lib/utils';
const timeAgo = formatNotificationTime(notification);
```
**Explanation:**  
Rather than formatting time everywhere in the codebase, this function is used throughout for consistency.

### API Service

```typescript
const notifications = await getNotifications();
await markNotificationAsRead(notificationId);
const { unread_count } = await getUnreadCount();
```
**Explanation:**  
All API calls related to notifications are centralized, making the code easier to maintain and update.

## Key Features

### Backend-Driven Notifications
- Notifications are universally stored and managed on the backend.
- The frontend simply fetches them, so notifications persist across devices and sessions.
- Real-time delivery is possible using WebSocket for instant updates.

### Robust Timestamp Handling
- Time formatting is handled on the backend for consistency.
- Handles future dates gracefully.
- If backend data is unavailable, the frontend can perform its own formatting.
- Uses UTC for timezone consistency.

### Automatic Notification Creation
- Friend requests and similar actions trigger notifications automatically.
- Ensures all users receive relevant updates without manual frontend logic.

### Reliable State Management
- The Zustand store ensures notifications are fetched and updated as needed.
- Unread counts are always accurate.
- Loading states inform users when data is being fetched.

### Settings Management
- Users can enable or disable notifications globally.
- They can configure preferences for each notification type.
- Settings are stored in the frontend for quick access.

## File Structure

```
Backend:
├── routers/
│   ├── notifications.py          # Notification endpoints
│   └── friends.py               # Friend endpoints with notification integration
├── schemas/
│   ├── notification.py          # Notification schema models
│   └── friend.py                # Friend request schema models
└── db/
    └── crud.py                  # Database operations and timestamp logic

Frontend:
├── store/
│   └── notification-store.ts    # Notification state management
├── lib/
│   └── utils.ts                 # Utility functions for formatting
├── app/
│   ├── api/
│   │   ├── notifications.ts     # API service for notifications
│   │   └── friends.ts           # API service for friend interactions
│   ├── (dashboard)/
│   │   ├── components/
│   │   │   └── Notifications.tsx # UI dropdown for notifications
│   │   └── dashboard/
│   │       └── notifications/
│   │           └── page.tsx     # Notification list page
│   └── (settings)/
│       └── settings/
│           └── notification/
│               └── page.tsx     # Notification settings page
└── types/
    └── index.ts                 # Type definitions for notifications
```

**Explanation:**  
This organized structure separates concerns and makes the codebase easier to maintain and extend.

## Best Practices

1. **Backend Responsibility:**  
   All notification logic is centralized on the backend, ensuring consistency and reliability.

2. **API-First:**  
   The frontend never directly manipulates notifications; it communicates via APIs.

3. **Error Handling:**  
   API errors are handled gracefully so users are informed if something goes wrong.

4. **Loading States:**  
   Loading indicators are displayed while data is being fetched, improving user experience.

5. **Caching:**  
   Notifications are cached on the frontend for performance, but refreshed as needed.

6. **Real-time:**  
   The backend can push notifications instantly to users when significant events occur.

7. **Timestamp Consistency:**  
   Both backend and frontend use centralized utilities for formatting timestamps.

## Notification Flow

1. **User Action:**  
   A user does something significant (e.g., sends a friend request).

2. **Backend Processing:**  
   The backend processes the event and creates a notification.

3. **Timestamp Formatting:**  
   The backend calculates and formats the notification’s timestamp.

4. **Frontend Fetch:**  
   The frontend fetches the latest notifications via API.

5. **UI Update:**  
   The notification UI updates, displaying the new notification with formatted timestamp.

**Explanation:**  
This flow ensures users are promptly and consistently informed about important events.

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
**Explanation:**  
Each notification record contains identifiers, type, content, priority, links, metadata, read status, and timestamps.

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
**Explanation:**  
Notifications in the frontend mirror backend fields, with optional formatted and relative timestamps for display.

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

**Explanation:**  
Backend provides concise formats, while frontend adds context for user readability.

## Future Enhancements

- Real-time notifications using WebSocket for instant delivery.
- Email alerts for important events.
- Push notifications for mobile users.
- Sound effects for new notifications.
- Custom notification message templates.
- History and archiving of notifications.
- Advanced user preferences for notification types.
- Bulk notification management features.

---

If you need further elaboration on any section or want example code, let me know!
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
