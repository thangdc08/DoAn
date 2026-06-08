import apiClient from './apiClient';
import type { User } from '../types/auth.types';
import type { PaymentTransaction } from '../types/payment.types';

const unwrapData = <T>(payload: any): T => {
  if (payload?.data !== undefined) return payload.data as T;
  if (payload?.result !== undefined) return payload.result as T;
  return payload as T;
};

export const adminApi = {
  // User Management
  getUsers: async (params?: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: User[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/identity/api/v1/admin/users', { params });
    return unwrapData(response.data);
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/identity/api/v1/admin/users/${userId}`);
    return unwrapData(response.data);
  },

  updateUserStatus: async (userId: string, status: string): Promise<void> => {
    await apiClient.patch(`/identity/api/v1/admin/users/${userId}/status`, { status });
  },

  updateUserRoles: async (userId: string, roleCodes: string[]): Promise<void> => {
    await apiClient.patch(`/identity/api/v1/admin/users/${userId}/roles`, { roleCodes });
  },

  // Payment Oversight
  getAllPayments: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: PaymentTransaction[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/payments/api/payments', { params });
    return unwrapData(response.data);
  },

  getPaymentById: async (transactionId: string): Promise<PaymentTransaction> => {
    const response = await apiClient.get(`/payments/api/payments/${transactionId}`);
    return unwrapData(response.data);
  },

  // System Settings — backed by identity-service
  getSettings: async (): Promise<Record<string, string>> => {
    const response = await apiClient.get('/identity/api/v1/admin/system-config');
    return unwrapData(response.data) ?? {};
  },

  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    await apiClient.put('/identity/api/v1/admin/system-config', settings);
  },

  getPublicConfig: async (): Promise<Record<string, string>> => {
    const response = await apiClient.get('/identity/api/v1/config/public');
    return unwrapData(response.data) ?? {};
  },
};
