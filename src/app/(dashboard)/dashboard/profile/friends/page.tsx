'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Search, Trash2, Bell, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  getFriends,
  getPendingRequests,
  getSentRequests,
  searchFriends,
} from '@/app/api/friends';
import { useFriendRequestActions } from '@/components/FriendRequestActions';

import { User, FriendResponse, SearchResponse, PendingRequestResponse } from '@/types';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const queryClient = useQueryClient();

  const { 
    data: friendsData, 
    isLoading: loadingFriends,
    error: friendsError 
  } = useQuery<FriendResponse[]>({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { 
    data: pendingRequestsData, 
    isLoading: loadingRequests,
    error: requestsError 
  } = useQuery<PendingRequestResponse[]>({
    queryKey: ["pendingRequests"],
    queryFn: getPendingRequests,
  });

  const { 
    data: sentRequestsData, 
    isLoading: loadingSentRequests,
    error: sentRequestsError 
  } = useQuery<PendingRequestResponse[]>({
    queryKey: ["sentRequests"],
    queryFn: getSentRequests,
  });

  const friends = Array.isArray(friendsData) ? friendsData : [];
  const pendingRequests = Array.isArray(pendingRequestsData) ? pendingRequestsData : [];
  const sentRequests = Array.isArray(sentRequestsData) ? sentRequestsData : [];

  const {
    sendFriendRequestAction,
    acceptFriendRequestAction,
    declineFriendRequestAction,
    removeFriendAction,
    sendRequestMutation,
    acceptMutation,
    declineMutation,
    removeMutation
  } = useFriendRequestActions();

  const handleSendFriendRequestAction = (user: User) => {
    sendFriendRequestAction(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  const searchMutation = useMutation({
    mutationFn: searchFriends,
    onSuccess: (data: SearchResponse) => {
      setSearchResults(data.users || []);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Search failed");
      setSearchResults([]);
    },
  });

  const handleSearch = (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    searchMutation.mutate(query);
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequestAction(requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequestAction(requestId);
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    removeFriendAction(friendId, friendName);
  };

  const getFriendUser = (friend: FriendResponse): User => {
    return friend.friend || {
      id: friend.sender_id || friend.receiver_id,
      username: 'Unknown User',
      email: ''
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const UserCard = ({ 
    user, 
    action, 
    actionLabel, 
    actionIcon: ActionIcon, 
    actionVariant = 'primary', 
    isLoading = false,
    subtitle
  }: {
    user: User;
    action?: (user: User) => void;
    actionLabel?: string;
    actionIcon?: React.ComponentType<{ className?: string }>;
    actionVariant?: 'primary' | 'secondary' | 'success' | 'danger';
    isLoading?: boolean;
    subtitle?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <CardTitle className="font-semibold text-gray-900">{user.username}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center space-x-3">
          <Image
            src={user.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username || 'Unknown User'}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full bg-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
            }}
          />
          <div>
            <p className="text-sm text-gray-500">{user.email}</p>
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
      {action && ActionIcon && (
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => action(user)}
            disabled={isLoading}
            variant={
              actionVariant === 'danger' ? 'destructive' :
              actionVariant === 'success' ? 'secondary' :
              actionVariant === 'secondary' ? 'secondary' :
              'default'
            }
            size="sm"
            className="inline-flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
            ) : (
              <ActionIcon className="w-4 h-4 mr-1" />
            )}
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const RequestCard = ({ request }: { request: PendingRequestResponse }) => {
    const senderUser = request.sender || {
      id: request.sender_id,
      username: 'Unknown User',
      email: ''
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-0">
          <CardTitle className="font-semibold text-gray-900">{senderUser.username}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center space-x-3">
            <Image
              src={senderUser.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderUser.username}`}
              alt={senderUser.username || 'Unknown User'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full bg-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderUser.username}`;
              }}
            />
            <div>
              <p className="text-sm text-gray-500">{senderUser.email}</p>
              <p className="text-xs text-gray-400">
                {request.created_at ? formatDate(request.created_at) : 'Unknown date'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex space-x-2">
            <Button
              onClick={() => handleAcceptRequest(request.id)}
              disabled={acceptMutation.isPending}
              variant="secondary"
              size="sm"
              className="inline-flex items-center text-green-700 bg-green-50 hover:bg-green-100"
            >
              {acceptMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-1"></div>
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              Accept
            </Button>
            <Button
              onClick={() => handleDeclineRequest(request.id)}
              disabled={declineMutation.isPending}
              variant="destructive"
              size="sm"
              className="inline-flex items-center"
            >
              {declineMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-1"></div>
              ) : (
                <X className="w-4 h-4 mr-1" />
              )}
              Decline
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const SentRequestCard = ({ request }: { request: PendingRequestResponse }) => {
    const receiverUser = request.receiver || {
      id: request.receiver_id,
      username: 'Unknown User',
      email: ''
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-0">
          <CardTitle className="font-semibold text-gray-900">{receiverUser.username}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center space-x-3">
            <Image
              src={receiverUser.profile_picture_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverUser.username}`}
              alt={receiverUser.username || 'Unknown User'}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full bg-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiverUser.username}`;
              }}
            />
            <div>
              <p className="text-sm text-gray-500">{receiverUser.email}</p>
              <p className="text-xs text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Sent {request.created_at ? formatDate(request.created_at) : 'Unknown date'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Friends</h1>
              <p className="text-blue-100 mt-1">Manage your connections</p>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{friends.length}</div>
                <div className="text-sm opacity-90">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <div className="text-sm opacity-90">Requests</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="flex space-x-8 border-b border-gray-200 bg-transparent p-0">
              <TabsTrigger value="friends" className="flex items-center py-4 px-1 border-b-2 font-medium text-sm">
                <Users className="w-5 h-5 mr-2" />
                My Friends
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center py-4 px-1 border-b-2 font-medium text-sm">
                <Bell className="w-5 h-5 mr-2" />
                Friend Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{pendingRequests.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center py-4 px-1 border-b-2 font-medium text-sm">
                <Clock className="w-5 h-5 mr-2" />
                Sent Requests
                {sentRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{sentRequests.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center py-4 px-1 border-b-2 font-medium text-sm">
                <Search className="w-5 h-5 mr-2" />
                Find Friends
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="friends">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Friends ({friends.length})
                  </h2>
                </div>
                
                {loadingFriends ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading friends...</p>
                  </div>
                ) : friendsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">Failed to load friends</div>
                    <button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["friends"] })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : friends.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
                    <p className="text-gray-500 mb-4">Start by searching for people to connect with</p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Friends
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {friends.map(friend => {
                      const friendUser = getFriendUser(friend);
                      return (
                        <UserCard
                          key={friendUser.id}
                          user={friendUser}
                          action={(user) => handleRemoveFriend(user.id, user.username || '')}
                          actionLabel="Remove"
                          actionIcon={Trash2}
                          actionVariant="danger"
                          isLoading={removeMutation.isPending}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Friend Requests ({pendingRequests.length})
                  </h2>
                </div>
                
                {loadingRequests ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading requests...</p>
                  </div>
                ) : requestsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">Failed to load requests</div>
                    <button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-500">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request: PendingRequestResponse) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sent">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sent Requests ({sentRequests.length})
                  </h2>
                </div>
                
                {loadingSentRequests ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading sent requests...</p>
                  </div>
                ) : sentRequestsError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">Failed to load sent requests</div>
                    <button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["sentRequests"] })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : sentRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                    <p className="text-gray-500">You haven&apos;t sent any friend requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request: PendingRequestResponse) => (
                      <SentRequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="search">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Friends</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {searchMutation.isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Searching...</p>
                </div>
              ) : searchQuery.length < 2 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Search for friends</h3>
                  <p className="text-gray-500">Enter at least 2 characters to start searching</p>
                </div>
              ) : searchResults.length === 0 && !searchMutation.isPending ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      action={handleSendFriendRequestAction}
                      actionLabel="Add Friend"
                      actionIcon={UserPlus}
                      actionVariant="primary"
                      isLoading={sendRequestMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;