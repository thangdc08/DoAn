import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3,
  Building2, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, HelpCircle, FileCheck, Swords,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────

export type DashboardRole = 'USER' | 'OWNER' | 'ADMIN';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
  role?: DashboardRole;
  /** Tên người dùng hiển thị */
  userName?: string;
  /** Avatar URL */
  userAvatar?: string;
}

// ── Menu config per role ──────────────────────────────────────────────────

interface MenuItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const USER_MENU: MenuItem[] = [
  { to: '/dashboard',              label: 'Tổng quan',        icon: <LayoutDashboard size={18} /> },
  { to: '/dashboard/bookings',     label: 'Booking của tôi',  icon: <CalendarDays    size={18} /> },
  { to: '/dashboard/matches',      label: 'Kèo của tôi',      icon: <Swords          size={18} /> },
  { to: '/dashboard/notifications',label: 'Thông báo',        icon: <Bell            size={18} /> },
  { to: '/dashboard/profile',      label: 'Hồ sơ',            icon: <Users           size={18} /> },
];

const OWNER_MENU: MenuItem[] = [
  { to: '/owner',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/owner/venues',     label: 'Quản lý sân',    icon: <Building2       size={18} /> },
  { to: '/owner/bookings',   label: 'Booking',         icon: <CalendarDays    size={18} /> },
  { to: '/owner/revenue',    label: 'Doanh thu',       icon: <BarChart3       size={18} /> },
  { to: '/owner/support',    label: 'Hỗ trợ',          icon: <HelpCircle      size={18} /> },
];

const ADMIN_MENU: MenuItem[] = [
  { to: '/admin',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users',      label: 'Người dùng',     icon: <Users           size={18} /> },
  { to: '/admin/venues',     label: 'Duyệt sân',      icon: <FileCheck       size={18} /> },
  { to: '/admin/reports',    label: 'Báo cáo',         icon: <BarChart3       size={18} /> },
  { to: '/admin/settings',   label: 'Cấu hình',        icon: <Settings        size={18} /> },
];

const MENUS: Record<DashboardRole, MenuItem[]> = {
  USER:  USER_MENU,
  OWNER: OWNER_MENU,
  ADMIN: ADMIN_MENU,
};

const ROLE_LABELS: Record<DashboardRole, string> = {
  USER:  'Người chơi',
  OWNER: 'Chủ sân',
  ADMIN: 'Quản trị viên',
};

const ROLE_COLORS: Record<DashboardRole, string> = {
  USER:  'bg-brand-green-light text-brand-green',
  OWNER: 'bg-blue-50 text-brand-blue',
  ADMIN: 'bg-purple-50 text-purple-700',
};

// ── Sidebar nav item ──────────────────────────────────────────────────────

const SidebarItem: React.FC<MenuItem & { collapsed: boolean }> = ({
  to, label, icon, collapsed,
}) => (
  <NavLink
    to={to}
    end={to.split('/').length <= 2}
    className={({ isActive }) =>
      clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold',
        'transition-all duration-150 group',
        isActive
          ? 'bg-brand-green text-white shadow-sm'
          : 'text-app-muted hover:bg-app-bg hover:text-app-text',
        collapsed && 'justify-center',
      )
    }
    title={collapsed ? label : undefined}
  >
    <span className="flex-shrink-0 transition-transform group-hover:scale-110">
      {icon}
    </span>
    {!collapsed && (
      <span className="truncate">{label}</span>
    )}
  </NavLink>
);

// ── Main component ────────────────────────────────────────────────────────

/**
 * DashboardLayout — layout sidebar dùng cho USER / OWNER / ADMIN dashboard.
 * Menu tự thay đổi theo `role` prop.
 * Sidebar có thể collapse.
 *
 * @example
 * <DashboardLayout role="OWNER" userName="Nguyễn Văn A">
 *   <VenueManagePage />
 * </DashboardLayout>
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role = 'USER',
  userName = 'Người dùng',
  userAvatar,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const menu = MENUS[role];
  const sidebarW = collapsed ? 'w-16' : 'w-60';

  return (
    <div className="flex min-h-screen bg-app-bg">

      {/* ══ Sidebar ═══════════════════════════════════════════ */}
      <aside
        className={clsx(
          'flex flex-col flex-shrink-0 bg-app-surface border-r border-app-border',
          'sticky top-0 h-screen overflow-hidden',
          'transition-all duration-300',
          sidebarW,
        )}
      >
        {/* Logo */}
        <div className={clsx(
          'flex items-center h-16 px-4 border-b border-app-border flex-shrink-0',
          collapsed ? 'justify-center' : 'gap-2.5',
        )}>
          <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white text-base font-black flex-shrink-0">
            🏸
          </div>
          {!collapsed && (
            <span className="text-lg font-black text-app-text tracking-tight truncate">
              Badminton<span className="text-brand-green">Hub</span>
            </span>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <span className={clsx(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold',
              ROLE_COLORS[role],
            )}>
              {ROLE_LABELS[role]}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
          {menu.map((item) => (
            <SidebarItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User info + collapse button */}
        <div className="flex-shrink-0 border-t border-app-border p-2">
          {/* User row */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-xl hover:bg-app-bg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-green flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-sm font-bold">
                {userAvatar
                  ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                  : userName.charAt(0).toUpperCase()
                }
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-app-text truncate">{userName}</p>
                <p className="text-xs text-app-muted truncate">{ROLE_LABELS[role]}</p>
              </div>
              <LogOut size={14} className="text-app-muted flex-shrink-0" />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={clsx(
              'w-full flex items-center justify-center py-2 px-3 rounded-xl',
              'text-app-muted hover:bg-app-bg hover:text-app-text transition-colors text-xs gap-1.5 font-semibold',
            )}
          >
            {collapsed
              ? <ChevronRight size={16} />
              : <><ChevronLeft size={15} /><span>Thu gọn</span></>
            }
          </button>
        </div>
      </aside>

      {/* ══ Main area ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-app-surface border-b border-app-border shadow-app-sm flex-shrink-0">
          <div>
            <p className="text-xs text-app-muted font-medium">
              {ROLE_LABELS[role]} Dashboard
            </p>
            <h2 className="text-base font-bold text-app-text leading-tight">
              Xin chào, {userName.split(' ').at(-1)} 👋
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-app-muted hover:bg-app-bg transition-colors"
              aria-label="Thông báo"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-white" />
            </button>

            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-app-muted hover:bg-app-bg transition-colors"
              aria-label="Cài đặt"
            >
              <Settings size={18} />
            </button>

            <div className="w-8 h-8 rounded-full bg-brand-green overflow-hidden flex items-center justify-center text-white text-sm font-bold ml-1 flex-shrink-0">
              {userAvatar
                ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                : userName.charAt(0).toUpperCase()
              }
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
