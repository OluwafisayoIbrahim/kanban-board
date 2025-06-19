import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/index";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearToken: () => set({ token: null }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // key for localStorage
    }
  )
);
