import apiClient from './apiClient';
import type { User } from '../types/auth.types';

export const friendApi = {
  sendRequest: async (friendId: string): Promise<void> => {
    await apiClient.post(`/identity/api/v1/friends/request`, null, {
      params: { friendId },
    });
  },

  acceptRequest: async (friendId: string): Promise<void> => {
    await apiClient.post(`/identity/api/v1/friends/accept`, null, {
      params: { friendId },
    });
  },

  declineRequest: async (friendId: string): Promise<void> => {
    await apiClient.post(`/identity/api/v1/friends/decline`, null, {
      params: { friendId },
    });
  },

  getFriends: async (): Promise<User[]> => {
    const response = await apiClient.get(`/identity/api/v1/friends`);
    return response.data.result || [];
  },

  getPendingRequests: async (): Promise<User[]> => {
    const response = await apiClient.get(`/identity/api/v1/friends/pending`);
    return response.data.result || [];
  },

  getRelationStatus: async (friendId: string): Promise<string> => {
    const response = await apiClient.get(`/identity/api/v1/friends/status`, {
      params: { friendId },
    });
    return response.data;
  },

  removeFriend: async (friendId: string): Promise<void> => {
    await apiClient.delete(`/identity/api/v1/friends`, {
      params: { friendId },
    });
  },
};
