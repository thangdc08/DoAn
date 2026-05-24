import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Dropdown, Badge, Avatar, message, Typography, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3,
  Building2, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, HelpCircle, FileCheck, Swords, MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { BRAND } from '../theme/antdTheme';

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────

export type DashboardRole = 'USER' | 'OWNER' | 'ADMIN';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
  role?: DashboardRole;
}

// ── Menu config per role ──────────────────────────────────────────────────

interface MenuItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const USER_MENU: MenuItem[] = [
  { to: '/user/dashboard',         label: 'Tổng quan',        icon: <LayoutDashboard size={18} /> },
  { to: '/user/bookings',          label: 'Booking của tôi',  icon: <CalendarDays    size={18} /> },
  { to: '/user/challenges',        label: 'Kèo của tôi',      icon: <Swords          size={18} /> },
  { to: '/user/chat',              label: 'Tin nhắn',         icon: <MessageSquare    size={18} /> },
  { to: '/user/notifications',     label: 'Thông báo',        icon: <Bell            size={18} /> },
  { to: '/user/profile',           label: 'Hồ sơ',            icon: <Users           size={18} /> },
];

const OWNER_MENU: MenuItem[] = [
  { to: '/owner',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/owner/venues',     label: 'Quản lý sân',    icon: <Building2       size={18} /> },
  { to: '/owner/bookings',   label: 'Booking',         icon: <CalendarDays    size={18} /> },
  { to: '/owner/chat',       label: 'Tin nhắn',        icon: <MessageSquare    size={18} /> },
  { to: '/owner/revenue',    label: 'Doanh thu',       icon: <BarChart3       size={18} /> },
  { to: '/owner/settings',   label: 'Cấu hình',        icon: <Settings        size={18} /> },
  { to: '/owner/support',    label: 'Hỗ trợ',          icon: <HelpCircle      size={18} /> },
];

const ADMIN_MENU: MenuItem[] = [
  { to: '/admin',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users',      label: 'Người dùng',     icon: <Users           size={18} /> },
  { to: '/admin/venues',     label: 'Duyệt sân',      icon: <FileCheck       size={18} /> },
  { to: '/admin/reports',    label: 'Báo cáo',         icon: <BarChart3       size={18} /> },
  { to: '/admin/settings',   label: 'Cấu hình',        icon: <Settings        size={18} /> },
  { to: '/admin/support',    label: 'Hỗ trợ',          icon: <HelpCircle      size={18} /> },
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

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role = 'USER',
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const userName = user?.fullName || 'Người dùng';
  const userAvatar = user?.avatarUrl;
  const [collapsed, setCollapsed] = useState(false);
  const menu = MENUS[role];
  const sidebarW = collapsed ? 'w-16' : 'w-60';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    message.success('Đã đăng xuất thành công');
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Hồ sơ của tôi',
      icon: <Users size={14} />,
      onClick: () => navigate(`/${role.toLowerCase()}/profile`),
    },
    {
      key: 'settings',
      label: 'Cài đặt tài khoản',
      icon: <Settings size={14} />,
      onClick: () => navigate(`/${role.toLowerCase()}/settings`),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      danger: true,
      icon: <LogOut size={14} />,
      onClick: handleLogout,
    },
  ];

  const notificationMenu = (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-80 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <span className="font-bold text-gray-800">Thông báo</span>
        <button className="text-xs text-brand-green font-semibold">Đánh dấu đã đọc</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {[
          { id: 1, title: 'Booking mới', desc: 'Có một khách hàng vừa đặt Sân 1 vào lúc 18:00', time: '5 phút trước', unread: true },
          { id: 2, title: 'Thanh toán thành công', desc: 'Doanh thu +200.000đ từ booking #BK102', time: '1 giờ trước', unread: false },
          { id: 3, title: 'Nhắc nhở lịch', desc: 'Bạn có 3 ca làm việc sắp tới vào ngày mai', time: '3 giờ trước', unread: false },
        ].map(n => (
          <div key={n.id} className={clsx("px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors", n.unread && "bg-brand-green/5")}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-bold text-gray-800">{n.title}</span>
              <span className="text-[10px] text-gray-400">{n.time}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{n.desc}</p>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 text-center border-t border-gray-50">
        <button className="text-xs text-gray-400 hover:text-brand-green font-medium">Xem tất cả thông báo</button>
      </div>
    </div>
  );

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
        <div 
          className={clsx(
            'flex items-center h-16 px-4 border-b border-app-border flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
          onClick={() => navigate('/')}
        >
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

        {/* Collapse toggle */}
        <div className="flex-shrink-0 border-t border-app-border p-2">
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
            <Dropdown dropdownRender={() => notificationMenu} trigger={['click']} placement="bottomRight">
              <button
                type="button"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-app-muted hover:bg-app-bg transition-colors"
                aria-label="Thông báo"
              >
                <Badge dot color="#ff4d4f" offset={[-4, 4]}>
                  <Bell size={20} />
                </Badge>
              </button>
            </Dropdown>

            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-app-muted hover:bg-app-bg transition-colors"
              aria-label="Cài đặt"
              onClick={() => navigate(`/${role.toLowerCase()}/settings`)}
            >
              <Settings size={20} />
            </button>

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div 
              className="flex items-center gap-2 ml-2 p-1 pr-3 rounded-xl hover:bg-app-bg cursor-pointer transition-colors group"
              onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)}
            >
              <Avatar 
                size={36} 
                src={userAvatar} 
                className="bg-brand-green font-bold group-hover:scale-105 transition-transform"
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <div className="hidden sm:block text-right">
                 <p className="text-xs font-bold text-app-text leading-tight">{userName.split(' ').at(-1)}</p>
                 <p className="text-[10px] text-app-muted leading-tight">{ROLE_LABELS[role]}</p>
              </div>
            </div>
            </Dropdown>
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
