import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

const DEFAULT_API_BASE_URL = '/api';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!envUrl) {
    return DEFAULT_API_BASE_URL;
  }

  try {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return new URL(envUrl).toString().replace(/\/$/, '');
    }

    if (envUrl.startsWith('/') && !envUrl.includes(';') && !envUrl.includes('\\')) {
      return envUrl.replace(/\/$/, '');
    }
  } catch {
    // Fall back below.
  }

  console.warn('Invalid VITE_API_BASE_URL ignored:', envUrl);
  return DEFAULT_API_BASE_URL;
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const requestUrl = originalRequest?.url ?? '';
    const isPublicAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicAuthRequest) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
        
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        // Call refresh token API
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = response.data.result?.access_token;
        if (!newAccessToken) {
          throw new Error('Refresh response does not include an access token');
        }
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
