import React from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AppPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Breadcrumb hoặc back-link */
  breadcrumb?: React.ReactNode;
  /** Nút/actions bên phải */
  actions?: React.ReactNode;
  /** Border phía dưới */
  bordered?: boolean;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AppPageHeader — header chuẩn hóa cho mọi trang nội dung.
 *
 * @example
 * <AppPageHeader
 *   title="Quản lý sân"
 *   description="Danh sách các sân bạn đang quản lý"
 *   actions={<AppButton variant="primary">Thêm sân</AppButton>}
 *   bordered
 * />
 */
export const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  title,
  description,
  breadcrumb,
  actions,
  bordered = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between',
        bordered && 'border-b border-app-border pb-5',
        className,
      )}
    >
      {/* Left: breadcrumb + title */}
      <div className="min-w-0 flex-1">
        {breadcrumb && (
          <div className="mb-1.5 text-sm text-app-muted">{breadcrumb}</div>
        )}
        <h1 className="text-2xl font-bold text-app-text leading-tight truncate">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-app-muted leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Right: actions */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default AppPageHeader;
