import { ReactNode } from "react";

export type priority = "Urgent" | "Warning" | "Normal";

export type IconProps = React.SVGProps<SVGElement> & {
  className?: string;
}

export type AuthType = "signin" | "signup";

export interface AuthFormProps {
  type?: AuthType;
  onSubmit?: (
    formData:
      | { email: string; password: string }
      | { username: string; email: string; password: string }
  ) => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export interface ProfileResponse {
  profile_picture_url: string | null;
  status: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "friend_request" | "friend_accept" | "friend_decline" | "friend_removed_by_other" | "friend_removed_by_you" | "deadline" | "reminder" | "overdue" | "task_assigned" | "task_completed";
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
    removerUsername?: string;
    removedUsername?: string;
    [key: string]: string | undefined;
  };
  is_read: boolean;
  created_at: string; 
  updated_at?: string; 
  created_at_formatted?: string;  
  created_at_relative?: string; 
}

export interface NotificationSettings {
  enabled: boolean;
  friendRequests: boolean;
  taskUpdates: boolean;
  deadlines: boolean;
  reminders: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  board_id: string;
  creator_id: string;
  due_date?: string; // ISO string format
  position: number;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
  assignees?: any[]; // List of assignee objects
  tags?: string[];
}

export interface ProfileData {
  profile_picture_url: string | null;
  username: string;
  email: string;
}

export interface SearchProps {
  tasks?: Task[];
  isLoading?: boolean;
  onSelect?: (task: Task) => void;
  placeholder?: string;
}

export interface ProfilePictureResponse {
  profile_picture_url: string | null;
  status: string;
  username?: string;
  email?: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
  status: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username?: string;
    email: string;
  };
}

export interface APIError {
  detail: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface AuthState {
  clearToken: () => void;
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  hasNewNotifications: boolean;
  isLoading: boolean;
  deletingNotificationId: string | null; 
  
  
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  setHasNewNotifications: (hasNew: boolean) => void;
  resetUnreadCount: () => void;
  resetNotificationStore: () => void;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  profile_picture_url?: string;
}

export interface FriendResponse {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  friend: User;
  sender?: User;
  receiver?: User;
}

export interface PendingRequestResponse {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  direction: 'received' | 'sent';
  sender?: User;
  receiver?: User;
}

export interface SearchResponse {
  users: User[];
  query: string;
  status: string;
}

export interface AllRequestsResponse {
  received: PendingRequestResponse[];
  sent: PendingRequestResponse[];
  status: string;
}

export interface FriendRequestCreate {
  username?: string;
  email?: string;
}