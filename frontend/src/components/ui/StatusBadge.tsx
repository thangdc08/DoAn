import React from 'react';
import { AppBadge, type BadgeVariant } from './AppBadge';

// ── Status registry ────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

/**
 * Map tất cả trạng thái nghiệp vụ trong hệ thống.
 * Chỉ cập nhật đây khi thêm status mới.
 */
const STATUS_MAP: Record<string, StatusConfig> = {
  // ── Slot ────────────────────────────────────────────────────
  AVAILABLE: { label: 'Còn trống',   variant: 'success' },
  LOCKED:    { label: 'Đang giữ',    variant: 'warning' },
  BOOKED:    { label: 'Đã đặt',      variant: 'neutral' },
  CLOSED:    { label: 'Đã đóng',     variant: 'neutral' },

  // ── Booking ─────────────────────────────────────────────────
  PENDING:   { label: 'Chờ xử lý',       variant: 'pending' },
  PAID:      { label: 'Đã thanh toán',    variant: 'success' },
  FAILED:    { label: 'Thất bại',         variant: 'error'   },
  EXPIRED:   { label: 'Hết hạn',          variant: 'neutral' },
  CONFIRMED: { label: 'Đã xác nhận',      variant: 'success' },
  CANCELLED: { label: 'Đã hủy',           variant: 'error'   },
  COMPLETED: { label: 'Hoàn thành',       variant: 'neutral' },

  // ── Payment ─────────────────────────────────────────────────
  SUCCESS:    { label: 'Thành công',   variant: 'success' },
  PROCESSING: { label: 'Đang xử lý',  variant: 'pending' },

  // ── Match post ──────────────────────────────────────────────
  OPEN:     { label: 'Đang mở',       variant: 'success' },
  FINISHED: { label: 'Đã kết thúc',   variant: 'info'    },

  // ── Venue ───────────────────────────────────────────────────
  PENDING_APPROVAL: { label: 'Chờ duyệt',  variant: 'pending' },
  APPROVED:         { label: 'Đã duyệt',   variant: 'success' },
  REJECTED:         { label: 'Từ chối',    variant: 'error'   },
  HIDDEN:           { label: 'Đã ẩn',      variant: 'neutral' },

  // ── Venue opening ────────────────────────────────────────────
  OPENING:      { label: 'Đang mở cửa',  variant: 'success' },
  CLOSED_VENUE: { label: 'Đã đóng cửa',  variant: 'neutral' },

  // ── Match privacy ────────────────────────────────────────────
  PUBLIC:  { label: 'Công khai', variant: 'primary' },
  PRIVATE: { label: 'Nội bộ',   variant: 'warning' },
};

const FALLBACK: StatusConfig = { label: 'Không xác định', variant: 'neutral' };

// ── Props ─────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  /** Status key (vd: "PENDING", "APPROVED", ...) */
  status: string;
  /** Ghi đè label mặc định */
  label?: string;
  /** Hiện dot indicator */
  dot?: boolean;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * StatusBadge — badge trạng thái nghiệp vụ.
 * Tự động map status key → màu + label tiếng Việt.
 *
 * @example
 * <StatusBadge status="PENDING" />         // → "Chờ xử lý" (tím)
 * <StatusBadge status="APPROVED" dot />    // → "Đã duyệt" (xanh, có dot)
 * <StatusBadge status="LOCKED" label="Giữ slot" />  // override label
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  dot = false,
  className,
}) => {
  const config = STATUS_MAP[status.toUpperCase()] ?? FALLBACK;

  return (
    <AppBadge variant={config.variant} dot={dot} className={className}>
      {label ?? config.label}
    </AppBadge>
  );
};

export default StatusBadge;
