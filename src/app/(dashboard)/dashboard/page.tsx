"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/api";
import { Loader } from "lucide-react";
import { JSX, useEffect } from "react";
import { toast } from "sonner";
import { useLogout } from "../../hooks/useLogout";
import { LogoutButton } from "@/components/LogOutButton";
import ProfilePictureComponent from "../components/ProfilePicture";

interface ApiSuccessResponse {
  status: "success";
  username: string;
  email: string;
  id: string;
}

interface ApiErrorResponse {
  status: 401 | 403 | 500;
  error?: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

const WELCOME_MESSAGES: readonly string[] = [
  "Welcome back, {username}! 🎉",
  "Hello {username}! Ready to be productive? 💪",
  "Great to see you again, {username}! ✨",
  "Welcome to your dashboard, {username}! 🚀",
] as const;

export default function DashboardPage(): JSX.Element {
  const { 
    data: response, 
    isLoading, 
    isError 
  } = useQuery<ApiResponse, Error>({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  useEffect((): void => {
    if (response) {
      if (response.status === "success") {
        const randomMessage: string = WELCOME_MESSAGES[
          Math.floor(Math.random() * WELCOME_MESSAGES.length)
        ].replace("{username}", response.username);
        
        toast.success(randomMessage, {
          description: "Your dashboard is ready to use",
          duration: 4000,
        });
      } else if (response.status === 401) {
        toast.error("Oops! Authentication failed", {
          description: response.error || "Your session may have expired",
          action: {
            label: "Sign In",
            onClick: (): void => {
              window.location.href = "/signin";
            }
          },
        });
      }
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("Connection failed", {
      description: "Unable to connect to server. Please try again.",
    });
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">
          Failed to load your profile due to network error.
        </p>
        <button 
          onClick={(): void => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (response?.status === 401) {
    const errorResponse = response as ApiErrorResponse;
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">
          {errorResponse.error || "Authentication failed"}
        </p>
        <a 
          href="/signin" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          Sign In Again
        </a>
      </div>
    );
  }

  if (response?.status === "success") {
    const successResponse = response as ApiSuccessResponse;
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Section with Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0">
              <ProfilePictureComponent />
            </div>
            
            {/* User Info Section */}
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {successResponse.username}! 👋
              </h1>
              <p className="text-gray-600 mb-1">
                Email: <span className="font-medium">{successResponse.email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                User ID: #{successResponse.id}
              </p>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kanban Board Section */}
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              📋 Your Kanban Board
            </h2>
            <p className="text-gray-600 mb-4">
              Your kanban board components will be rendered here...
            </p>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Kanban board placeholder</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Create New Board
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Add Team Member
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📈 Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Profile Updated</p>
                <p className="text-xs text-blue-600">Just now</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">Logged In</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              ⚙️ Profile Settings
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Account Settings
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Privacy Settings
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h2 className="text-red-800 font-semibold mb-2">Debug Information</h2>
        <p className="text-red-700 mb-2">Unexpected response format received:</p>
        <pre className="bg-red-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={(): void => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Page
        </button>
        <a 
          href="/signin" 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Sign In Again
        </a>
      </div>
    </div>
  );
}