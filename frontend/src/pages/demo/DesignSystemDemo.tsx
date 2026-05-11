import React from 'react';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { AppBadge } from '../../components/ui/AppBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AppInput } from '../../components/ui/AppInput';
import { AppPageHeader } from '../../components/ui/AppPageHeader';
import { Mail, Search, Star, MapPin, Clock, Users } from 'lucide-react';
import { colors, gradients } from '../../styles/theme';

// ── Section wrapper ────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title, children,
}) => (
  <section className="mb-12">
    <h2 className="text-xs font-black uppercase tracking-[0.15em] text-app-muted mb-5 flex items-center gap-3">
      <span>{title}</span>
      <span className="flex-1 h-px bg-app-border" />
    </h2>
    {children}
  </section>
);

// ── Swatch ─────────────────────────────────────────────────────────────────

const Swatch: React.FC<{ color: string; name: string; value: string }> = ({
  color, name, value,
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="h-14 w-full rounded-xl border border-black/5 shadow-sm"
      style={{ background: color }}
    />
    <div>
      <p className="text-xs font-bold text-app-text">{name}</p>
      <p className="text-xs text-app-muted font-mono">{value}</p>
    </div>
  </div>
);

// ── Main demo page ─────────────────────────────────────────────────────────

/**
 * DesignSystemDemo — trang showcase toàn bộ design system components.
 * Route: /design-system (chỉ dùng trong development)
 */
const DesignSystemDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg">
      {/* Hero */}
      <div
        className="py-16 px-8 text-white text-center mb-0"
        style={{ background: gradients.sport }}
      >
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold mb-5 border border-white/20">
          <span className="text-brand-lime">●</span> Design System v1.0
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-3">
          BadmintonHub Design System
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Component library và design token cho nền tảng đặt sân cầu lông.
        </p>
        <div className="flex justify-center gap-3 mt-7 flex-wrap">
          <AppButton variant="lime" size="lg">Đặt sân ngay</AppButton>
          <AppButton variant="outline" size="lg"
            className="border-white/40 text-white hover:bg-white/10 hover:border-white hover:text-white bg-transparent"
          >
            Xem tài liệu
          </AppButton>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* AppPageHeader demo */}
        <Section title="Page Header">
          <div className="bg-app-surface rounded-app border border-app-border p-6 shadow-app-sm">
            <AppPageHeader
              title="Quản lý sân cầu lông"
              description="Danh sách các sân đang hoạt động trong hệ thống. Duyệt, ẩn hoặc chỉnh sửa thông tin sân."
              breadcrumb={
                <span className="text-brand-green hover:underline cursor-pointer">← Tổng quan</span>
              }
              actions={
                <>
                  <AppButton variant="outline" size="sm">Xuất báo cáo</AppButton>
                  <AppButton variant="primary" size="sm">Thêm sân mới</AppButton>
                </>
              }
              bordered
            />
          </div>
        </Section>

        {/* Color palette */}
        <Section title="Color Palette">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
            <Swatch color={colors.primary}      name="Primary Green"  value="#00A651" />
            <Swatch color={colors.primaryDark}  name="Green Dark"     value="#007A3D" />
            <Swatch color={colors.primaryLight} name="Green Light"    value="#E6F7EF" />
            <Swatch color={colors.secondary}    name="Brand Blue"     value="#005BAC" />
            <Swatch color={colors.accentLime}   name="Accent Lime"    value="#B6E900" />
            <Swatch color={colors.accentOrange} name="Accent Orange"  value="#FF7A00" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            <Swatch color={colors.success} name="Success" value="#22C55E" />
            <Swatch color={colors.warning} name="Warning" value="#F59E0B" />
            <Swatch color={colors.error}   name="Error"   value="#EF4444" />
            <Swatch color={colors.info}    name="Info"    value="#3B82F6" />
            <Swatch color={colors.pending} name="Pending" value="#A855F7" />
          </div>
        </Section>

        {/* Buttons */}
        <Section title="AppButton">
          <div className="space-y-5">
            {/* Variants */}
            <div className="flex flex-wrap gap-3 items-center">
              <AppButton variant="primary">Primary</AppButton>
              <AppButton variant="secondary">Secondary</AppButton>
              <AppButton variant="outline">Outline</AppButton>
              <AppButton variant="ghost">Ghost</AppButton>
              <AppButton variant="danger">Danger</AppButton>
              <AppButton variant="warning">Warning</AppButton>
              <AppButton variant="lime">Lime</AppButton>
            </div>
            {/* Sizes */}
            <div className="flex flex-wrap gap-3 items-center">
              <AppButton variant="primary" size="sm">Small</AppButton>
              <AppButton variant="primary" size="md">Medium</AppButton>
              <AppButton variant="primary" size="lg">Large</AppButton>
            </div>
            {/* States */}
            <div className="flex flex-wrap gap-3 items-center">
              <AppButton variant="primary" loading>Loading...</AppButton>
              <AppButton variant="primary" disabled>Disabled</AppButton>
              <AppButton variant="primary" leftIcon={<Search size={15} />}>Tìm kiếm</AppButton>
              <AppButton variant="secondary" leftIcon={<MapPin size={15} />}>Gần tôi</AppButton>
            </div>
          </div>
        </Section>

        {/* Badges */}
        <Section title="AppBadge">
          <div className="flex flex-wrap gap-3 mb-4">
            <AppBadge variant="primary">Primary</AppBadge>
            <AppBadge variant="secondary">Secondary</AppBadge>
            <AppBadge variant="success">Success</AppBadge>
            <AppBadge variant="warning">Warning</AppBadge>
            <AppBadge variant="error">Error</AppBadge>
            <AppBadge variant="info">Info</AppBadge>
            <AppBadge variant="pending">Pending</AppBadge>
            <AppBadge variant="neutral">Neutral</AppBadge>
            <AppBadge variant="lime">Lime</AppBadge>
          </div>
          <div className="flex flex-wrap gap-3">
            <AppBadge variant="success" dot>Có dot</AppBadge>
            <AppBadge variant="pending" dot>Đang xử lý</AppBadge>
            <AppBadge variant="error" dot>Lỗi</AppBadge>
          </div>
        </Section>

        {/* StatusBadge */}
        <Section title="StatusBadge (Nghiệp vụ)">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              'AVAILABLE', 'LOCKED', 'BOOKED', 'CLOSED',
              'PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CONFIRMED', 'CANCELLED',
              'OPEN', 'FINISHED',
              'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HIDDEN',
              'PUBLIC', 'PRIVATE', 'OPENING',
            ].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <StatusBadge status={status} />
                <code className="text-xs text-app-muted">{status}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* Inputs */}
        <Section title="AppInput">
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            <AppInput label="Email" type="email" placeholder="you@example.com"
              leftIcon={<Mail size={15} />} />
            <AppInput label="Tìm kiếm sân" placeholder="Nhập tên sân..."
              leftIcon={<Search size={15} />} />
            <AppInput label="Mật khẩu (có lỗi)" type="password" placeholder="••••••••"
              error="Mật khẩu phải có ít nhất 8 ký tự" />
            <AppInput label="Số điện thoại" placeholder="0912 345 678"
              helperText="Định dạng: 09xx xxx xxx" required />
          </div>
        </Section>

        {/* Cards */}
        <Section title="AppCard">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Basic card */}
            <AppCard
              title="Sân Đào Duy Anh"
              description="21 Đào Duy Anh, Phú Nhuận"
              extra={<StatusBadge status="APPROVED" />}
            >
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm text-app-muted">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" /> 4.8
                </div>
                <div className="flex items-center gap-1 text-sm text-app-muted">
                  <Users size={13} /> 8 sân
                </div>
                <div className="flex items-center gap-1 text-sm text-app-muted">
                  <Clock size={13} /> 05:00 – 22:00
                </div>
              </div>
              <AppButton variant="primary" size="sm" className="w-full mt-4">
                Đặt sân
              </AppButton>
            </AppCard>

            {/* Kèo card */}
            <AppCard
              title="Giao lưu tối nay – Nhóm Vui"
              description="Sân Viettel, Quận 10 · 20:00 – 22:00"
              extra={<StatusBadge status="OPEN" dot />}
            >
              <div className="mt-3 flex items-center justify-between">
                <AppBadge variant="primary" dot>Trung bình</AppBadge>
                <span className="text-sm font-bold text-brand-green">50.000đ</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-app-muted mb-1">
                  <span>Tham gia</span>
                  <span className="font-bold text-app-text">6/8</span>
                </div>
                <div className="h-1.5 bg-app-border rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <AppButton variant="outline" size="sm" className="w-full mt-4">
                Đăng ký tham gia
              </AppButton>
            </AppCard>

            {/* Hoverable card */}
            <AppCard
              title="Doanh thu tháng 5"
              description="So với tháng trước"
              hoverable
              extra={<AppBadge variant="success">+12.4%</AppBadge>}
            >
              <p className="text-3xl font-black text-app-text mt-2">
                12.4 <span className="text-lg text-app-muted font-normal">triệu đ</span>
              </p>
              <p className="text-xs text-app-muted mt-1">
                Hover card để xem hiệu ứng
              </p>
            </AppCard>
          </div>
        </Section>

        {/* Gradients */}
        <Section title="Gradients">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 rounded-app sport-gradient flex items-end p-4">
              <span className="text-white text-xs font-bold">.sport-gradient</span>
            </div>
            <div className="h-24 rounded-app sport-gradient-light border border-app-border flex items-end p-4">
              <span className="text-brand-green text-xs font-bold">.sport-gradient-light</span>
            </div>
            <div className="h-24 rounded-app hero-gradient flex items-end p-4">
              <span className="text-white text-xs font-bold">.hero-gradient</span>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default DesignSystemDemo;
