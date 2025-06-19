"use client";

import { useLogout } from "@/hooks/useLogout";
import { LogOut, Loader } from "lucide-react";
import { LogoutButtonProps } from "@/types/index";

export function LogoutButton({ 
  variant = "danger", 
  size = "md", 
  showIcon = true,
  className = "" 
}: LogoutButtonProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const baseClasses = "flex items-center gap-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {logoutMutation.isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="w-4 h-4" />
      )}
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
}