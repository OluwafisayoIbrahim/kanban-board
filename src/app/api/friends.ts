import { getRequest, postRequest, deleteRequest } from "@/lib/api";
import { FriendResponse, PendingRequestResponse, AllRequestsResponse, FriendRequestCreate, SearchResponse } from "@/types";

export const getFriends = async (): Promise<FriendResponse[]> => {
  try {
    const response = await getRequest('/api/friends/');
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.friends)) {
      return response.friends;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
        } catch {
    return [];
  }
};

export const getPendingRequests = async (): Promise<PendingRequestResponse[]> => {
  try {
    const response = await getRequest('/api/friends/requests/pending');
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.requests)) {
      return response.requests;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export const getSentRequests = async (): Promise<PendingRequestResponse[]> => {
  try {
    const response = await getRequest('/api/friends/requests/sent');
    
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.requests)) {
      return response.requests;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else {  
      return [];
    }
  } catch {
    return [];
  }
};

export const getAllRequests = async (): Promise<AllRequestsResponse> => {
  try {
    const response = await getRequest('/api/friends/requests/all');
    return response;
    } catch {
    return { received: [], sent: [], status: 'error' };
  }
};

export const sendFriendRequest = async (requestData: FriendRequestCreate): Promise<{ message: string }> => {
  try {
    const response = await postRequest('/api/friends/request', requestData);
    return response as { message: string };
  } catch {
    throw new Error('Failed to send friend request');
  }
};

export const acceptFriendRequest = async (requestId: string): Promise<{ message: string }> => {
  try {
    const response = await postRequest(`/api/friends/requests/${requestId}/accept`);
    return response as { message: string };
  } catch {
    throw new Error('Failed to accept friend request');
  }
};

export const declineFriendRequest = async (requestId: string): Promise<{ message: string }> => {
  try {
    const response = await postRequest(`/api/friends/requests/${requestId}/decline`);
    return response as { message: string };
  } catch {
    throw new Error('Failed to decline friend request');
  }
};

export const removeFriend = async (friendId: string): Promise<{ message: string }> => {
  try {
    const response = await deleteRequest(`/api/friends/${friendId}`);
    return response as { message: string };
  } catch {
    throw new Error('Failed to remove friend');
  }
};

export const searchFriends = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await getRequest(`/api/friends/search?query=${encodeURIComponent(query)}`);
    return response;
  } catch {
    throw new Error('Failed to search friends');
  }
};