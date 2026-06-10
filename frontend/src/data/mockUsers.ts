import type { User } from '../types/auth.types';

export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'user@example.com',
  phone: '0901234567',
  fullName: 'Nguyễn Văn A',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  status: 'ACTIVE',
  roles: [
    { id: 'role-1', code: 'USER', name: 'User' },
  ],
  profile: {
    id: 'profile-1',
    userId: 'user-1',
    level: 'TB',
    gender: 'MALE',
    goal: 'Tăng cường sức khỏe và kỹ năng',
    preferredArea: 'Quận 7, Quận 9',
    bio: 'Yêu thích cầu lông, chơi được 2 năm. Thích chơi đôi và giao lưu với mọi người.',
    freeTime: [
      { day: 'Thứ 2', slots: ['18:00-20:00'] },
      { day: 'Thứ 4', slots: ['18:00-20:00'] },
      { day: 'Thứ 7', slots: ['08:00-11:00'] },
    ],
    ratingAvg: 4.5,
    ratingCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-05-01T00:00:00Z',
};

export const mockOwnerUser: User = {
  id: 'owner-1',
  email: 'owner@example.com',
  phone: '0907654321',
  fullName: 'Trần Văn B',
  avatarUrl: 'https://i.pravatar.cc/150?img=2',
  status: 'ACTIVE',
  roles: [
    { id: 'role-1', code: 'USER', name: 'User' },
    { id: 'role-2', code: 'OWNER', name: 'Owner' },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-05-01T00:00:00Z',
};

export const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  fullName: 'Admin System',
  avatarUrl: 'https://i.pravatar.cc/150?img=10',
  status: 'ACTIVE',
  roles: [
    { id: 'role-1', code: 'USER', name: 'User' },
    { id: 'role-3', code: 'ADMIN', name: 'Admin' },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-05-01T00:00:00Z',
};

export const mockAllUsers: User[] = [
  mockCurrentUser,
  mockOwnerUser,
  mockAdminUser,
  {
    id: 'user-2',
    email: 'user2@example.com',
    fullName: 'Lê Thị C',
    status: 'ACTIVE',
    roles: [{ id: 'role-1', code: 'USER', name: 'User' }],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'user3@example.com',
    fullName: 'Phạm Văn D',
    status: 'INACTIVE',
    roles: [{ id: 'role-1', code: 'USER', name: 'User' }],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
];
