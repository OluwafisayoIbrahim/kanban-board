"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const storeToken = useAuthStore((s) => s.token);

  const getPersistedToken = () => {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.state?.token || null;
    } catch {
      return null;
    }
  };

  const token = storeToken || getPersistedToken();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
    }
  }, [isMounted, token]);

  useEffect(() => {
    if (isMounted && !token) {
      toast.error("You're signed out");
      router.push("/signin");
    }
  }, [isMounted, token, router]);

  if (!isMounted) return null;

  return token ? <>{children}</> : null;
}
