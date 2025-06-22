import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


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
    
    let errorMessage = "Request failed";
    if (data.detail) {
      errorMessage = Array.isArray(data.detail) 
        ? data.detail.map((err: { msg?: string; message?: string; }) => err.msg || err.message || err).join(", ")
        : data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (res.status === 422) {
      errorMessage = "Validation error: Please check your input";
    }
    
    throw new Error(errorMessage);
  }

  return data;
}

export async function putRequest<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().clearToken();
      localStorage.removeItem("auth_token");
    }
    
    let errorMessage = "Request failed";
    if (data.detail) {
      errorMessage = Array.isArray(data.detail) 
        ? data.detail.map((err: { msg?: string; message?: string; }) => err.msg || err.message || err).join(", ")
        : data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (res.status === 422) {
      errorMessage = "Validation error: Please check your input";
    }
    
    throw new Error(errorMessage);
  }

  return data;
}

export async function postFileRequest<T = unknown>(endpoint: string, file: File): Promise<T> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  
 
  
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
    
    
    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().clearToken();
        localStorage.removeItem("auth_token");
      }
      
      let errorMessage = "Request failed";
      let errorDetails: Record<string, unknown> = {};
      
      try {
        const data = await res.json();
        errorMessage = data.detail || data.message || `HTTP ${res.status}: ${res.statusText}`;
        errorDetails = data;
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      const error = new Error(errorMessage);
      (error as Error & { details: Record<string, unknown>; status: number }).details = errorDetails;
      (error as Error & { details: Record<string, unknown>; status: number }).status = res.status;
      throw error;
    }
    
    const data = await res.json();
    return data;
    
  } catch (fetchError) {  
    if (fetchError instanceof Error && fetchError.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw fetchError;
  }
}

export async function putFileRequest<T = unknown>(endpoint: string, file: File): Promise<T> {
  const token = useAuthStore.getState().token || localStorage.getItem("auth_token");
  
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
    
    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().clearToken();
        localStorage.removeItem("auth_token");
      }
      
      let errorMessage = "Request failed";
      let errorDetails: Record<string, unknown> = {};
      
      try {
        const data = await res.json();
        errorMessage = data.detail || data.message || `HTTP ${res.status}: ${res.statusText}`;
        errorDetails = data;
      } catch {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      }
      
      const error = new Error(errorMessage);
      (error as Error & { details: Record<string, unknown>; status: number }).details = errorDetails;
      (error as Error & { details: Record<string, unknown>; status: number }).status = res.status;
      throw error;
    }
    
    const data = await res.json();
    return data;
    
  } catch (fetchError) {
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