"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { getRequest } from "@/lib/api"
import { Loader } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [tokenSet, setTokenSet] = useState(false);

  const token = searchParams.get("access_token");

  useEffect(() => {
    if (token) {
      setToken(token);
      setTokenSet(true);
    } else {
      router.push("/signin?error=missing_token");
    }
  }, [token]);

  const {
    data: user,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getRequest("/api/auth/me"),
    enabled: tokenSet,
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess && user) {
      setUser(user.data);
      router.push("/dashboard");
    }
  }, [isSuccess, user]);

  if (error) {
    console.error("Auth failed:", error);
    router.push("/signin?error=auth_failed");
    return null;
  }

  return <Loader />
}
