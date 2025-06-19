"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { ProtectedRouteProps } from "@/types/index";

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const storeToken = useAuthStore((s) => s.token);

  const [localToken, setLocalToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          setLocalToken(parsed.state?.token ?? null);
        }
      } catch {
        setLocalToken(null);
      }
    }
  }, []);

  const token = storeToken ?? localToken;

  useEffect(() => {
    if (isMounted && !token) {
      toast.error("You're signed out");
      router.push("/signin");
    }
  }, [isMounted, token, router]);

  if (!isMounted) return null;

  return token ? <>{children}</> : null;
}
