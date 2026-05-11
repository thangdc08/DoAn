import React from 'react';
import { Tag } from 'antd';

/** Định nghĩa tất cả trạng thái trong hệ thống và màu tương ứng */
const STATUS_CONFIG = {
  // Booking status
  PENDING: { color: 'orange', label: 'Chờ thanh toán' },
  CONFIRMED: { color: 'green', label: 'Đã xác nhận' },
  CANCELLED: { color: 'red', label: 'Đã hủy' },
  COMPLETED: { color: 'default', label: 'Hoàn thành' },

  // Slot status
  AVAILABLE: { color: 'green', label: 'Còn trống' },
  BOOKED: { color: 'red', label: 'Đã đặt' },
  LOCKED: { color: 'orange', label: 'Đang giữ' },
  SELECTED: { color: 'cyan', label: 'Đang chọn' },

  // Match post status
  OPEN: { color: 'green', label: 'Đang mở' },
  CLOSED: { color: 'default', label: 'Đã đóng' },
  FULL: { color: 'red', label: 'Đã đủ người' },

  // Privacy
  PUBLIC: { color: 'green', label: 'Công khai' },
  PRIVATE: { color: 'gold', label: 'Nội bộ' },

  // Venue
  OPENING: { color: 'green', label: 'Đang mở cửa' },
  CLOSED_VENUE: { color: 'red', label: 'Đã đóng cửa' },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;

type StatusTagProps = {
  status: StatusKey;
  /** Ghi đè label mặc định nếu cần */
  label?: string;
  className?: string;
};

/**
 * StatusTag — component Tag dùng chung toàn app.
 * Màu và label được định nghĩa tập trung trong STATUS_CONFIG.
 */
const StatusTag: React.FC<StatusTagProps> = ({ status, label, className }) => {
  const config = STATUS_CONFIG[status];
  return (
    <Tag color={config.color} className={className} style={{ fontWeight: 600 }}>
      {label ?? config.label}
    </Tag>
  );
};

export default StatusTag;
