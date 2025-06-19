import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "@/app/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const LOGGED_OUT_MESSAGES = [
  "You have been logged out",
  "You've successfully logged out",
  "See you later! You're now logged out",
  "You're now logged out. Come back soon!",
  "You have been signed out",
  "You've been signed out. See you next time!",
  "You're now signed out. Have a great day!",
];

function getRandomMessage(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearToken = useAuthStore((state) => state.clearToken);

  const logoutMutation = useMutation({
    mutationFn: LogOut,
    onSuccess: () => {
      clearToken();
      localStorage.removeItem("auth_token");
      queryClient.clear();
      toast.success(getRandomMessage(LOGGED_OUT_MESSAGES));
      router.push("/");
    },
    onError: (error: unknown) => {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  return logoutMutation;
}