export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  level?: string;
  avatarUrl?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  goal?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  roles: string[];
  preferredAreas?: string[];
  availabilities?: UserAvailability[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Role {
  id: string;
  code: 'USER' | 'OWNER' | 'ADMIN';
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone?: string;
  password: string;
  fullName: string;
  level: string;
  role?: 'USER' | 'OWNER';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
