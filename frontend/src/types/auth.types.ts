export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  roles: Role[];
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  code: 'USER' | 'OWNER' | 'ADMIN';
  name: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  goal?: string;
  preferredArea?: string;
  bio?: string;
  freeTime?: any;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
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
  role?: 'USER' | 'OWNER';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
