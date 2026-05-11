import React from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AppCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Nội dung góc trên phải (actions, badge, ...) */
  extra?: React.ReactNode;
  /** Footer bên dưới */
  footer?: React.ReactNode;
  /** Tắt padding nội dung */
  noPadding?: boolean;
  /** Tắt border */
  noBorder?: boolean;
  /** Tắt shadow */
  noShadow?: boolean;
  /** Hover effect */
  hoverable?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AppCard — card container dùng chung toàn ứng dụng.
 *
 * @example
 * <AppCard title="Sân Đào Duy Anh" extra={<StatusBadge status="APPROVED" />}>
 *   <p>Nội dung card...</p>
 * </AppCard>
 */
export const AppCard: React.FC<AppCardProps> = ({
  title,
  description,
  extra,
  footer,
  noPadding = false,
  noBorder = false,
  noShadow = false,
  hoverable = false,
  className,
  bodyClassName,
  children,
  onClick,
}) => {
  const hasHeader = title || description || extra;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-app-surface rounded-app overflow-hidden',
        !noBorder && 'border border-app-border',
        !noShadow && 'shadow-app-sm',
        hoverable && 'transition-all duration-200 hover:shadow-app hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* Header */}
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-app-border">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-bold text-app-text leading-tight truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-app-muted leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {extra && <div className="flex-shrink-0">{extra}</div>}
        </div>
      )}

      {/* Body */}
      <div className={clsx(!noPadding && 'p-6', bodyClassName)}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-app-border bg-app-bg">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AppCard;
