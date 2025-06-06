import { useAuthStore } from "@/store/auth-store";
import { postRequest } from "./api";

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function signUp(userData: SignUpData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error: APIError = await response.json();
    throw new Error(error.detail || "Sign up failed");
  }
  return response.json();
}

export async function signIn(userData: SignInData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error: APIError = await response.json();
    throw new Error(error.detail || "Sign in failed");
  }
  return response.json();
}

export async function LogOut(): Promise<LogoutResponse> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await postRequest("/api/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
}
