import apiClient from './apiClient';
import type { User } from '../types/auth.types';
import type { PaymentTransaction } from '../types/payment.types';

export const adminApi = {
  // User Management
  getUsers: async (params?: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: User[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${userId}/status`, { status });
  },

  updateUserRoles: async (userId: string, roleCodes: string[]): Promise<void> => {
    await apiClient.patch(`/admin/users/${userId}/roles`, { roleCodes });
  },

  // Payment Oversight
  getAllPayments: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: PaymentTransaction[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/payments', { params });
    return response.data;
  },

  getPaymentById: async (transactionId: string): Promise<PaymentTransaction> => {
    const response = await apiClient.get(`/admin/payments/${transactionId}`);
    return response.data;
  },

  // System Settings
  getSettings: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: Record<string, any>): Promise<void> => {
    await apiClient.put('/admin/settings', settings);
  },
};
