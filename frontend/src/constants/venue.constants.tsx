import { 
  WifiOutlined, 
  CarOutlined, 
  ShopOutlined, 
  CoffeeOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';
import React from 'react';

export const VENUE_STATUS_MAP: Record<string, { label: string, color: string }> = {
  PENDING_APPROVAL: { label: 'Chờ duyệt', color: 'warning' },
  APPROVED: { label: 'Đang hoạt động', color: 'success' },
  REJECTED: { label: 'Bị từ chối', color: 'error' },
  SUSPENDED: { label: 'Tạm dừng', color: 'default' },
};

export const UTILITIES = [
  { label: 'Wifi miễn phí', value: 'wifi', icon: <WifiOutlined /> },
  { label: 'Bãi đỗ xe', value: 'parking', icon: <CarOutlined /> },
  { label: 'Tủ đồ riêng', value: 'locker', icon: <ShopOutlined /> },
  { label: 'Căng tin / Giải khát', value: 'canteen', icon: <CoffeeOutlined /> },
  { label: 'Nhà vệ sinh / Tắm', value: 'shower', icon: <ThunderboltOutlined /> },
  { label: 'Bán đồ cầu lông', value: 'rental', icon: <ShopOutlined /> },
];

export const AMENITIES_OPTIONS = UTILITIES.map(u => ({
  value: u.value,
  label: u.label
}));
