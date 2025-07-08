"use client";
import React, { useState, useRef, FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, X, Upload, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import {
  getProfilePicture,
  uploadProfilePicture,
  changeProfilePicture,
  deleteProfilePicture,
} from "@/app/api/profile";
import { ProfilePictureResponse } from "@/types/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Profile: FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery<ProfilePictureResponse>({
    queryKey: ["profile-picture"],
    queryFn: getProfilePicture,
    retry: 1,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (profileData?.profile_picture_url) {
        return changeProfilePicture(file);
      } else {
        return uploadProfilePicture(file);
      }
    },
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile-picture"] });
      setPreviewUrl(null);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update profile picture";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        const errorObj = error as Record<string, unknown>;
        errorMessage = (errorObj.detail as string) || (errorObj.message as string) || (errorObj.error as string) || "Unknown error occurred";
      }
      toast.error(errorMessage);
      setPreviewUrl(null);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      toast.success("Profile picture deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile-picture"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to delete profile picture";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        const errorObj = error as Record<string, unknown>;
        errorMessage = (errorObj.detail as string) || (errorObj.message as string) || (errorObj.error as string) || "Unknown error occurred";
      }
      
      toast.error(errorMessage);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center w- 32 h-32 bg-gray-100 rounded-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentImageUrl = previewUrl || profileData?.profile_picture_url;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-4">
          <CardTitle className="text-xl font-bold text-gray-900">Profile</CardTitle>
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={triggerFileInput}
              variant="ghost"
              size="icon"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              disabled={uploadMutation.isPending || deleteMutation.isPending}
            >
              <Camera className="w-8 h-8 text-white" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Input
            value={profileData?.username || ''}
            disabled
            className="w-full max-w-xs mb-2"
            placeholder="Username"
          />
          <div className="flex space-x-2">
            <Button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading || uploadMutation.isPending}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {isUploading || uploadMutation.isPending ? (
                <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Uploading...</span>
              ) : (
                <><Upload className="w-4 h-4 mr-1" />Upload</>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isUploading || uploadMutation.isPending}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            {profileData?.profile_picture_url && (
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Profile Picture</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your profile picture?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {deleteMutation.isPending && (
            <p className="text-sm text-gray-600">Deleting profile picture...</p>
          )}
          {profileError && (
            <p className="text-sm text-red-600">Failed to load profile picture</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Link href="/dashboard/profile/friends">
            <Button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span>Friends</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;