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
  id: number;
  type: "deadline" | "reminder" | "overdue";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'Normal' | 'Warning' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  tags: string[];
  createdAt: string;
}

export interface ProfileData {
  profile_picture_url: string | null;
  username: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  priority: priority;
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
  clearToken: any;
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}
