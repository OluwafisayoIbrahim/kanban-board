import { useAuthStore } from "@/store/auth-store";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getRequest(endpoint: string) {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
  
  const data = await res.json();
  if (!res.ok && res.status === 401) {
    useAuthStore.getState().clearToken();
    localStorage.removeItem("auth_token");
    return { status: 401, error: data.detail || "Authentication failed" };
  }

  return data;
}

export async function postRequest(endpoint: string, body?: any) {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().clearToken();
      localStorage.removeItem("auth_token");
    }
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const fetchMe = () => getRequest("/api/auth/me");