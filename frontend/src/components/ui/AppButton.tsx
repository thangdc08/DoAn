import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'warning'
  | 'lime';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ── Style maps ────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand-green text-white border-transparent',
    'hover:bg-brand-green-dark',
    'active:scale-[0.98]',
    'disabled:bg-brand-green/40',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  secondary: [
    'bg-brand-blue text-white border-transparent',
    'hover:bg-brand-blue-dark',
    'active:scale-[0.98]',
    'disabled:bg-brand-blue/40',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  outline: [
    'bg-transparent text-app-text border-app-border',
    'hover:bg-app-bg hover:border-brand-green hover:text-brand-green',
    'active:scale-[0.98]',
    'disabled:opacity-40',
  ].join(' '),

  ghost: [
    'bg-transparent text-app-muted border-transparent',
    'hover:bg-app-bg hover:text-app-text',
    'active:scale-[0.98]',
    'disabled:opacity-40',
  ].join(' '),

  danger: [
    'bg-status-error text-white border-transparent',
    'hover:bg-red-600',
    'active:scale-[0.98]',
    'disabled:bg-status-error/40',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  warning: [
    'bg-brand-orange text-white border-transparent',
    'hover:bg-orange-600',
    'active:scale-[0.98]',
    'disabled:bg-brand-orange/40',
    'shadow-sm hover:shadow-md',
  ].join(' '),

  lime: [
    'bg-brand-lime text-app-text border-transparent',
    'hover:brightness-95',
    'active:scale-[0.98]',
    'disabled:opacity-40',
    'shadow-sm',
  ].join(' '),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8  px-3  text-xs  gap-1.5 rounded-md',
  md: 'h-10 px-4  text-sm  gap-2   rounded-app',
  lg: 'h-12 px-6  text-base gap-2.5 rounded-app',
};

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AppButton — button component dùng chung toàn ứng dụng.
 *
 * @example
 * <AppButton variant="primary" size="lg" onClick={...}>Đặt sân ngay</AppButton>
 * <AppButton variant="outline" leftIcon={<FilterIcon />}>Bộ lọc</AppButton>
 * <AppButton variant="danger" loading>Đang xử lý...</AppButton>
 */
export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        // Base
        'inline-flex items-center justify-center',
        'font-semibold border',
        'transition-all duration-200',
        'select-none cursor-pointer',
        'disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:ring-offset-1',
        // Variant & size
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default AppButton;
