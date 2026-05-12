import apiClient from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '../types/auth.types';

export const authApi = {
  // Register new account
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/auth/refresh-token', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user info
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User['profile']>): Promise<User> => {
    const response = await apiClient.put('/users/me/profile', data);
    return response.data;
  },
};
