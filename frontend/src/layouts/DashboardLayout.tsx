import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Dropdown, Badge, Avatar, message, Typography, Space, notification } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3,
  Building2, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, HelpCircle, FileCheck, Swords, MessageSquare,
  Heart, CalendarCheck, Coins,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCommunityStore } from '../stores/communityStore';
import { useChatStore } from '../stores/chatStore';
import { chatSocket } from '../services/chatSocket';
import { chatApi } from '../services/chatApi';
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
  { to: '/chat',                   label: 'Tin nhắn',         icon: <MessageSquare   size={18} /> },
  { to: '/user/profile',           label: 'Hồ sơ',            icon: <Users           size={18} /> },
];

const OWNER_MENU: MenuItem[] = [
  { to: '/owner',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/owner/venues',     label: 'Quản lý sân',    icon: <Building2       size={18} /> },
  { to: '/owner/bookings',   label: 'Booking',         icon: <CalendarDays    size={18} /> },
  { to: '/chat',             label: 'Tin nhắn',        icon: <MessageSquare    size={18} /> },
  { to: '/owner/revenue',    label: 'Doanh thu',       icon: <BarChart3       size={18} /> },
  { to: '/owner/payouts',    label: 'Rút tiền',       icon: <Coins           size={18} /> },
  { to: '/owner/settings',   label: 'Cấu hình',        icon: <Settings        size={18} /> },
  { to: '/owner/support',    label: 'Hỗ trợ',          icon: <HelpCircle      size={18} /> },
];

const ADMIN_MENU: MenuItem[] = [
  { to: '/admin',            label: 'Tổng quan',      icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users',      label: 'Người dùng',     icon: <Users           size={18} /> },
  { to: '/admin/venues',     label: 'Duyệt sân',      icon: <FileCheck       size={18} /> },
  { to: '/admin/reports',    label: 'Báo cáo',         icon: <BarChart3       size={18} /> },
  { to: '/admin/payouts',    label: 'Yêu cầu rút tiền', icon: <Coins           size={18} /> },
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

  // Connect STOMP socket when logged in
  useEffect(() => {
    if (isAuthenticated) {
      chatSocket.connect();
      chatApi.getConversations().then((convs) => {
        if (convs?.length) useChatStore.getState().setConversations(convs);
      }).catch(console.error);
    } else {
      chatSocket.disconnect();
    }
  }, [isAuthenticated]);

  // Toast listener for new chat messages
  useEffect(() => {
    const handleNewMessage = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      // Do not notify if user is currently on the chat page
      if (window.location.pathname !== '/chat') {
        notification.info({
          message: `Tin nhắn mới từ ${msg.senderName}`,
          description: msg.content,
          placement: 'bottomRight',
          duration: 4,
          onClick: () => {
            navigate('/chat');
          },
          className: 'cursor-pointer hover:bg-slate-50 transition-colors',
        });
      }
    };

    window.addEventListener('new_chat_message', handleNewMessage);
    return () => window.removeEventListener('new_chat_message', handleNewMessage);
  }, [navigate]);

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
    
    // Links to other dashboard layouts if user has authority
    ...(role !== 'OWNER' && user?.roles?.includes('OWNER') ? [
      {
        key: 'owner-dashboard',
        label: 'Trang quản lý chủ sân',
        icon: <Building2 size={14} />,
        onClick: () => navigate('/owner'),
      }
    ] : []),
    ...(role !== 'ADMIN' && user?.roles?.includes('ADMIN') ? [
      {
        key: 'admin-dashboard',
        label: 'Quản trị hệ thống',
        icon: <FileCheck size={14} />,
        onClick: () => navigate('/admin'),
      }
    ] : []),
    ...(role !== 'USER' ? [
      {
        key: 'user-dashboard',
        label: 'Trang khách hàng',
        icon: <CalendarDays size={14} />,
        onClick: () => navigate('/user/dashboard'),
      }
    ] : []),

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

  const { favorites, selectedMatches, notifications, markNotificationAsRead, markAllNotificationsAsRead, fetchNotifications } = useCommunityStore();
  const conversations = useChatStore((s) => s.conversations);

  const favoriteCount = favorites.length;
  const selectedCount = selectedMatches.filter(sm => sm.selectedStatus !== 'deselected').length;
  const unreadNotifCount = notifications.filter(n => !n.readAt).length;
  const unreadChatCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Fetch real notifications when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications().catch(console.error);
      const interval = setInterval(() => {
        fetchNotifications().catch(console.error);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    switch (notif.type) {
      case 'BOOKING_PAID':
      case 'BOOKING_EXPIRED':
        navigate('/user/bookings');
        break;
      case 'MATCH_JOIN_REQUESTED':
        if (notif.data?.matchId) {
          const query = notif.data.userId ? `?userId=${notif.data.userId}` : '';
          navigate(`/community/matches/${notif.data.matchId}${query}`);
        } else {
          navigate('/user/challenges');
        }
        break;
      case 'MATCH_APPROVED':
      case 'MATCH_REJECTED':
        if (notif.data?.matchId) {
          navigate(`/community/matches/${notif.data.matchId}`);
        } else {
          navigate('/selected-matches');
        }
        break;
      case 'RATING_CREATED':
        navigate('/user/profile');
        break;
      case 'VENUE_APPROVED':
      case 'VENUE_REJECTED':
        navigate('/owner/venues');
        break;
      default:
        break;
    }
  };

  const notificationDropdown = (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-80 overflow-hidden mt-2 z-[1002]">
      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <span className="font-extrabold text-slate-800 text-sm">Thông báo</span>
        {unreadNotifCount > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              markAllNotificationsAsRead();
            }}
            className="text-xs text-brand-green hover:text-emerald-700 font-bold border-none bg-transparent cursor-pointer"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>
      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-semibold">Chưa có thông báo nào</div>
        ) : (
          notifications.map(n => {
            const getIcon = (type: string) => {
              const icons: Record<string, string> = {
                BOOKING_PAID: '✅',
                BOOKING_EXPIRED: '⏰',
                MATCH_JOIN_REQUESTED: '👥',
                MATCH_APPROVED: '✔️',
                MATCH_REJECTED: '❌',
                RATING_CREATED: '⭐',
                VENUE_APPROVED: '🏸',
                VENUE_REJECTED: '🚫',
              };
              return icons[type] || '📢';
            };
            return (
              <div 
                key={n.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotificationClick(n);
                }}
                className={clsx(
                  "px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 items-start", 
                  !n.readAt && "bg-emerald-500/[0.03]"
                )}
              >
                <span className="text-xl leading-none flex-shrink-0 mt-0.5">{getIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5 gap-1">
                    <span className={clsx("text-xs truncate text-slate-800", !n.readAt ? "font-bold" : "font-medium")}>
                      {n.title}
                    </span>
                    {!n.readAt && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{n.content}</p>
                </div>
              </div>
            );
          })
        )}
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

          <div className="flex items-center gap-3">
            {role === 'USER' && (
              <>
                {/* Heart Icon (Favorites) */}
                <Badge count={favoriteCount} size="small" color="#ef4444" offset={[-2, 2]}>
                  <button
                    onClick={() => navigate('/favorites')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:scale-105 transition-all duration-150 cursor-pointer"
                    title="Bài viết quan tâm"
                  >
                    <Heart size={16} fill={favoriteCount > 0 ? "#ef4444" : "none"} />
                  </button>
                </Badge>

                {/* Calendar Check Icon (Selected Matches) */}
                <Badge count={selectedCount} size="small" color="#10b981" offset={[-2, 2]}>
                  <button
                    onClick={() => navigate('/selected-matches')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:scale-105 transition-all duration-150 cursor-pointer"
                    title="Kèo đã chọn"
                  >
                    <CalendarCheck size={16} />
                  </button>
                </Badge>
              </>
            )}

            {/* Bell Icon (Notifications) */}
            <Dropdown dropdownRender={() => notificationDropdown} trigger={['click']} placement="bottomRight">
              <div>
                <Badge count={unreadNotifCount} size="small" color="#3b82f6" offset={[-2, 2]}>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-500 hover:scale-105 transition-all duration-150 cursor-pointer"
                    title="Thông báo"
                  >
                    <Bell size={16} />
                  </button>
                </Badge>
              </div>
            </Dropdown>

            {/* Message/Chat Icon */}
            <Badge count={unreadChatCount} size="small" color="#0ea5e9" offset={[-2, 2]}>
              <button
                onClick={() => navigate('/chat')}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 hover:scale-105 transition-all duration-150 cursor-pointer"
                title="Tin nhắn"
              >
                <MessageSquare size={16} />
              </button>
            </Badge>

            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-app-muted hover:bg-app-bg transition-colors cursor-pointer"
              aria-label="Cài đặt"
              onClick={() => navigate(`/${role.toLowerCase()}/settings`)}
            >
              <Settings size={18} />
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
