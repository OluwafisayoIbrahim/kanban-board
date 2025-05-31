import { useAuthStore } from "@/store/auth-store";

export async function getRequest(endpoint: string) {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, { headers });
  
  const data = await res.json();

  return data;
}
export const fetchMe = () => getRequest("/api/auth/me");