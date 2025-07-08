'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '@/app/api/friends';
import { User, FriendRequestCreate } from '@/types';
import { useNotificationStore } from '@/store/notification-store';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";

export const useFriendRequestActions = () => {
  const queryClient = useQueryClient();
  const { fetchNotifications, fetchUnreadCount } = useNotificationStore();

  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: async (data) => {
      toast.success(data.message || "Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      
      await fetchNotifications();
      await fetchUnreadCount();
    },
    onError: (error: Error) => {    
      toast.error(error.message || "Failed to send friend request");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async (data) => {
      toast.success(data.message || "Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      
      await fetchNotifications();
      await fetchUnreadCount();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept friend request");
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: async (data) => {
      toast.success(data.message || "Friend request declined.");
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
      
      await fetchNotifications();
      await fetchUnreadCount();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to decline friend request");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: async (data) => {
      toast.success(data.message || "Friend removed.");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      
      await fetchNotifications();
      await fetchUnreadCount();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove friend");
    },
  });

  const sendFriendRequestAction = (user: User) => {
    const requestData: FriendRequestCreate = { 
      username: user.username
    };
    sendRequestMutation.mutate(requestData);
  };

  const acceptFriendRequestAction = (requestId: string) => {
    acceptMutation.mutate(requestId);
  };

  const declineFriendRequestAction = (requestId: string) => {
    declineMutation.mutate(requestId);
  };

  const removeFriendAction = (friendId: string, friendName: string) => {
    setDialogState({ open: true, friendId, friendName });
  };

  // Dialog state and handler
  const [dialogState, setDialogState] = useState<{ open: boolean; friendId: string | null; friendName: string | null }>({ open: false, friendId: null, friendName: null });
  const handleConfirmRemove = () => {
    if (dialogState.friendId) {
      removeMutation.mutate(dialogState.friendId);
    }
    setDialogState({ open: false, friendId: null, friendName: null });
  };

  return {
    sendFriendRequestAction,
    acceptFriendRequestAction,
    declineFriendRequestAction,
    removeFriendAction,
    sendRequestMutation,
    acceptMutation,
    declineMutation,
    removeMutation,
    RemoveFriendDialog: (
      <AlertDialog open={dialogState.open} onOpenChange={open => setDialogState(s => ({ ...s, open }))}>
        <AlertDialogTrigger asChild>
          <span /> {/* Placeholder: actual trigger button should be passed in UI */}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {dialogState.friendName} from your friends?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  };
};