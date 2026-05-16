import apiClient from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  LogoutRequest,
} from '../types/auth.types';

const unwrapResult = <T>(response: { data: { result?: T } }): T => {
  if (response.data.result === undefined) {
    throw new Error('Phản hồi từ máy chủ không hợp lệ.');
  }
  return response.data.result;
};

export const authApi = {
  // Register new account
  register: async (data: RegisterRequest): Promise<any> => {
    const response = await apiClient.post('/identity/api/v1/auth/register', data);
    return unwrapResult(response);
  },

  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/identity/api/v1/auth/login', data);
    return unwrapResult<LoginResponse>(response);
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post('/identity/api/v1/auth/refresh', data);
    return unwrapResult<RefreshTokenResponse>(response);
  },

  // Logout
  logout: async (data: LogoutRequest): Promise<void> => {
    await apiClient.post('/identity/api/v1/auth/logout', data);
  },

  // Get current user info
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/identity/api/v1/users/me');
    return unwrapResult<User>(response);
  },

  // Update current user profile
  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/identity/api/v1/users/me', data);
    return unwrapResult<User>(response);
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/identity/api/v1/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // The raw string URL
  },
};
