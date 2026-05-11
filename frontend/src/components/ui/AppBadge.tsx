import React from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'lime';

export interface AppBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Dot indicator thay vì text */
  dot?: boolean;
  className?: string;
}

// ── Style map ─────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary:   'bg-brand-green-light  text-brand-green-dark',
  secondary: 'bg-blue-50            text-brand-blue-dark',
  success:   'bg-green-50           text-green-700',
  warning:   'bg-amber-50           text-amber-700',
  error:     'bg-red-50             text-red-700',
  info:      'bg-blue-50            text-blue-700',
  pending:   'bg-purple-50          text-purple-700',
  neutral:   'bg-slate-100          text-slate-600',
  lime:      'bg-lime-50            text-lime-700',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  primary:   'bg-brand-green',
  secondary: 'bg-brand-blue',
  success:   'bg-status-success',
  warning:   'bg-status-warning',
  error:     'bg-status-error',
  info:      'bg-status-info',
  pending:   'bg-status-pending',
  neutral:   'bg-slate-400',
  lime:      'bg-brand-lime',
};

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AppBadge — badge/chip component dùng chung.
 *
 * @example
 * <AppBadge variant="success">Đã thanh toán</AppBadge>
 * <AppBadge variant="pending" dot>Chờ xử lý</AppBadge>
 */
export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  variant = 'neutral',
  dot = false,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5',
        'rounded-full px-3 py-1',
        'text-xs font-semibold',
        'leading-none whitespace-nowrap',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT_COLORS[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
};

export default AppBadge;
