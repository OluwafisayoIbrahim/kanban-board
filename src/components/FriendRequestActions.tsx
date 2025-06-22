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
    if (window.confirm(`Are you sure you want to remove ${friendName} from your friends?`)) {
      removeMutation.mutate(friendId);
    }
  };

  return {
    sendFriendRequestAction,
    acceptFriendRequestAction,
    declineFriendRequestAction,
    removeFriendAction,
    sendRequestMutation,
    acceptMutation,
    declineMutation,
    removeMutation
  };
};