import apiClient from './apiClient';
import type { Notification, NotificationCount } from '../types/notification.types';

export const notificationApi = {
  // Get my notifications
  getMyNotifications: async (params?: {
    page?: number;
    size?: number;
  }): Promise<{ content: Notification[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/notifications/my', { params });
    return response.data.result !== undefined ? response.data.result : response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<NotificationCount> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.result !== undefined ? response.data.result : response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};
