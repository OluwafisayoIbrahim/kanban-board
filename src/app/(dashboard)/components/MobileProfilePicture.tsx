"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  UserCircle,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  LayoutDashboard,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getProfilePicture } from "@/app/api/profile";    
import { useAuthStore } from "@/store/auth-store";
import { LogOut as apiLogOut } from "@/app/api/auth";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { ProfilePictureResponse } from "@/types/index";



const MobileProfileMenu: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const clearToken = useAuthStore((s) => s.clearToken);
  const { data: profile } = useQuery<ProfilePictureResponse>({
    queryKey: ["profile-picture"],
    queryFn: getProfilePicture,
    retry: 1,
  });

  const handleLogout = async () => {
    try {
      await apiLogOut();
      clearToken();
      localStorage.removeItem("auth_token");
      toast.success("Signed out");
      router.push("/");
      window.location.href = "/";
    } catch {
      toast.error("Logout failed");
    }
  };

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
    <div className="lg:hidden mr-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-[8px] overflow-hidden">
            {profile?.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt="Avatar"
                className="w-full h-full object-cover rounded-[8px]"
              />
            ) : (
              <User className="w-full h-full text-gray-500" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={8}
          className="w-64 bg-white rounded-xl shadow-lg py-2 overflow-hidden"
        >
          <div className="p-4 border-b">
            <div className="flex flex-col items-center space-y-1">
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
              <p className="text-sm font-medium text-gray-900">
                {profile?.username}
              </p>
              <p className="text-xs text-gray-500">{profile?.email}</p>
            </div>
          </div>
          <div className="py-1">
            {menuItems.map(({ icon: Icon, label, path }, idx) => (
              <DropdownMenuItem
                key={idx}
                asChild
                className="flex items-center px-4 py-2 hover:bg-gray-50"
              >
                <Link href={path} className="flex items-center w-full">
                  <Icon className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileProfileMenu;
