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

export async function postRequest<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
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

export async function postFileRequest<T = unknown>(endpoint: string, file: File): Promise<T> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  
  console.log("Upload attempt:", {
    endpoint: `${API_BASE_URL}${endpoint}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 10) + "..." : "none"
  });
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    console.log("Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().clearToken();
        localStorage.removeItem("auth_token");
      }
      
      let errorMessage = "Request failed";
      let errorDetails: Record<string, unknown> = {};
      
      try {
        const data = await res.json();
        console.log("Error response data:", data);
        errorMessage = data.detail || data.message || `HTTP ${res.status}: ${res.statusText}`;
        errorDetails = data;
      } catch {
        console.log("Failed to parse error response as JSON");
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      const error = new Error(errorMessage);
      (error as Error & { details: Record<string, unknown>; status: number }).details = errorDetails;
      (error as Error & { details: Record<string, unknown>; status: number }).status = res.status;
      throw error;
    }
    
    const data = await res.json();
    console.log("Success response:", data);
    return data;
    
  } catch (fetchError) {
    console.error("Fetch error:", fetchError);
    if (fetchError instanceof Error && fetchError.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw fetchError;
  }
}

export async function putFileRequest<T = unknown>(endpoint: string, file: File): Promise<T> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  
  console.log("Update attempt:", {
    endpoint: `${API_BASE_URL}${endpoint}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasToken: !!token
  });
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    console.log("Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().clearToken();
        localStorage.removeItem("auth_token");
      }
      
      let errorMessage = "Request failed";
      let errorDetails: Record<string, unknown> = {};
      
      try {
        const data = await res.json();
        console.log("Error response data:", data);
        errorMessage = data.detail || data.message || `HTTP ${res.status}: ${res.statusText}`;
        errorDetails = data;
      } catch {
        console.log("Failed to parse error response as JSON");
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      const error = new Error(errorMessage);
      (error as Error & { details: Record<string, unknown>; status: number }).details = errorDetails;
      (error as Error & { details: Record<string, unknown>; status: number }).status = res.status;
      throw error;
    }
    
    const data = await res.json();
    console.log("Success response:", data);
    return data;
    
  } catch (fetchError) {
    console.error("Fetch error:", fetchError);
    if (fetchError instanceof Error && fetchError.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw fetchError;
  }
}

export async function deleteRequest(endpoint: string) {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers,
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