import React from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AuthLayoutProps {
  /** Tiêu đề trên card */
  title?: string;
  /** Mô tả ngắn dưới tiêu đề */
  subtitle?: string;
  children: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * AuthLayout — layout dùng cho Login / Register / ForgotPassword.
 * Nền gradient sport, card trắng canh giữa.
 *
 * @example
 * <AuthLayout title="Đăng nhập" subtitle="Chào mừng trở lại!">
 *   <LoginForm />
 * </AuthLayout>
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 hero-gradient relative overflow-hidden">

      {/* Background decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #B6E900, transparent)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #005BAC, transparent)' }}
      />

      {/* Card */}
      <div className={clsx(
        'relative z-10 w-full max-w-md',
        'bg-app-surface rounded-app shadow-app-lg',
        'px-8 py-10',
      )}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white text-xl font-black shadow-sm">
            🏸
          </div>
          <span className="text-2xl font-black text-app-text tracking-tight">
            Badminton<span className="text-brand-green">Hub</span>
          </span>
        </div>

        {/* Title */}
        {title && (
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-app-text">{title}</h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-app-muted">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-5 text-xs text-white/50 text-center">
        © 2025 BadmintonHub · Nền tảng đặt sân cầu lông Việt Nam
      </p>
    </div>
  );
};

export default AuthLayout;
