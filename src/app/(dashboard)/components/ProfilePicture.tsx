"use client";
import React, { useState, useRef, useEffect, FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Settings,
  UserCircle,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getProfilePicture } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { LogOut as apiLogOut } from "@/lib/auth";
import { toast } from "sonner";

interface ProfilePictureResponse {
  profile_picture_url: string | null;
  status: string;
  username?: string;
  email?: string;
}

const ProfilePicture: FC = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const clearToken = useAuthStore((store) => store.clearToken);

  const { data: profileData, isLoading: isLoadingProfile } =
    useQuery<ProfilePictureResponse>({
      queryKey: ["profile-picture"],
      queryFn: getProfilePicture,
      retry: 1,
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    console.log("Logging out...");
    try {
      await apiLogOut();
      clearToken();
      localStorage.removeItem("auth_token");
      router.push("/");
      window.location.href = "/";
      toast.success("You have been signed out of your account");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  const allMenuItems = [
    { icon: UserCircle, label: "Account", path: "/dashboard/profile" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: Bell, label: "Notifications", path: "/settings/notification" },
    { icon: Shield, label: "Privacy", path: "/dashboard/privacy" },
    { icon: HelpCircle, label: "Help & Support", path: "/dashboard/help" },
  ];

  const homeItem = { icon: Home, label: "Home", path: "/" };

  let menuItems = allMenuItems.filter(item =>
    item.label === "Dashboard" ? pathname === "/" : true
  );
  

  if (pathname.startsWith("/dashboard")) {
    menuItems = [homeItem, ...menuItems];
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleProfileClick}
        className="flex items-center space-x-2 p-1 cursor-pointer rounded-full transition-colors focus:outline-none"
      >
        <div className="w-[98px] h-[98px] rounded-xl overflow-hidden">
          {profileData?.profile_picture_url ? (
            <img
              src={profileData.profile_picture_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {profileData?.profile_picture_url ? (
                  <img
                    src={profileData.profile_picture_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  {profileData?.username || "User Name"}
                </p>
                <p className="text-xs text-gray-500">
                  {profileData?.email || "Email Address"}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.path)}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-4 h-4 mr-3 text-gray-500" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
