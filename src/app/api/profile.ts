import { getRequest, postFileRequest, putFileRequest, deleteRequest } from "@/lib/api";
import type { ProfilePictureResponse } from "@/types";

export const getProfilePicture = (): Promise<ProfilePictureResponse> =>
  getRequest("/api/profile/profile-picture");

export const uploadProfilePicture = (file: File) =>
  postFileRequest("/api/profile/upload-profile-picture", file);

export const changeProfilePicture = (file: File) =>
  putFileRequest("/api/profile/profile-picture", file);

export const deleteProfilePicture = () =>
  deleteRequest("/api/profile/profile-picture");