import { useAuthStore } from "@/store/auth-store";
import { postRequest } from "@/lib/api";
import { SignUpData, SignInData, AuthResponse, APIError, LogoutResponse } from "@/types/index";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function signUp(userData: SignUpData): Promise<AuthResponse> {
  return postRequest("/api/auth/signup", userData);
}

export async function signIn(userData: SignInData): Promise<AuthResponse> {
  return postRequest("/api/auth/signin", userData);
}

export async function LogOut(): Promise<LogoutResponse> {
  return postRequest("/api/auth/logout");
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
export type { SignInData };