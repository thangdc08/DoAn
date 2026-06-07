import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { AppButton } from '../components/ui/AppButton';
import {
  Menu, X, User, Mail, Phone, MapPin, ExternalLink, Smartphone, Heart, CalendarCheck, Bell, MessageSquare
} from 'lucide-react';
import { 
  FacebookFilled, 
  InstagramFilled, 
  TwitterCircleFilled, 
  YoutubeFilled 
} from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import { useCommunityStore } from '../stores/communityStore';
import { useChatStore } from '../stores/chatStore';
import { chatSocket } from '../services/chatSocket';
import { chatApi } from '../services/chatApi';
import { authApi } from '../services/authApi';
import { Avatar, Divider, Button, Typography, Dropdown, Badge, type MenuProps, notification } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, CalendarOutlined, ShopOutlined, DashboardOutlined } from '@ant-design/icons';
import { SmashMateChatbot } from '../components/layout/SmashMateChatbot';

const { Text } = Typography;

const NAV_LINKS = [
  { to: '/venues', label: 'Khám phá sân' },
  { to: '/map', label: 'Bản đồ' },
  { to: '/community', label: 'Cộng đồng' },
  { to: '/pricing', label: 'Bảng giá' },
  { to: '/about', label: 'Về chúng tôi' },
];

const FOOTER_LINKS = {
  platform: [
    { label: 'Về BadmintonHub', to: '/about' },
    { label: 'Quy trình đặt sân', to: '/guide' },
    { label: 'Hợp tác chủ sân', to: '/owner' },
    { label: 'Tin tức & Sự kiện', to: '/news' },
  ],
  support: [
    { label: 'Trung tâm trợ giúp', to: '/help' },
    { label: 'Điều khoản sử dụng', to: '/terms' },
    { label: 'Chính sách bảo mật', to: '/privacy' },
    { label: 'Câu hỏi thường gặp', to: '/faq' },
  ],
  contact: [
    { icon: <Mail size={16} />, text: 'contact@badmintonhub.vn' },
    { icon: <Phone size={16} />, text: '1900 1234' },
    { icon: <MapPin size={16} />, text: 'Lê Văn Lương, Cầu Giấy, Hà Nội' },
  ]
};

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
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

  const handleLogout = () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      authApi.logout({ refreshToken }).catch(console.error);
    }
    logout();
    navigate('/');
  };

  const handleMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'owner-dashboard') {
      navigate('/owner');
    } else if (key === 'admin-dashboard') {
      navigate('/admin');
    } else {
      navigate(`/user/${key}`);
    }
  };


  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ của tôi' },
    { key: 'bookings', icon: <CalendarOutlined />, label: 'Đơn đặt sân' },
    
    // Links for special roles
    ...(user?.roles?.includes('OWNER') ? [
      { key: 'owner-dashboard', icon: <ShopOutlined />, label: 'Trang quản lý chủ sân' }
    ] : []),

    
    ...(user?.roles?.includes('ADMIN') ? [
      { key: 'admin-dashboard', icon: <DashboardOutlined />, label: 'Quản trị hệ thống', onClick: () => navigate('/admin') }
    ] : []),

    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-app-bg font-sans">
      {/* ══ Header ══════════════════════════════════════════════ */}
      <header className={clsx(
        "sticky top-0 z-[1001] transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-2" : "bg-white py-4"
      )}>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo - Left */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 group flex-shrink-0 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-300">
                <span className="text-xl">🏸</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Badminton<span className="text-brand-green">Hub</span>
                </span>
                <Text style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Premium Platform</Text>
              </div>
            </div>

            {/* Navigation - Center */}
            <nav className="hidden lg:flex items-center bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 text-[14px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap',
                      isActive
                        ? 'text-brand-green bg-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* Heart Icon (Favorites) */}
                  <Badge count={favoriteCount} size="small" color="#ef4444" offset={[-2, 2]}>
                    <button
                      onClick={() => navigate('/favorites')}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:scale-105 transition-all duration-200 cursor-pointer"
                      title="Bài viết quan tâm"
                    >
                      <Heart size={18} fill={favoriteCount > 0 ? "#ef4444" : "none"} />
                    </button>
                  </Badge>

                  {/* Calendar Check Icon (Selected Matches) */}
                  <Badge count={selectedCount} size="small" color="#10b981" offset={[-2, 2]}>
                    <button
                      onClick={() => navigate('/selected-matches')}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                      title="Kèo đã chọn"
                    >
                      <CalendarCheck size={18} />
                    </button>
                  </Badge>

                  {/* Bell Icon (Notifications) */}
                  <Dropdown dropdownRender={() => notificationDropdown} trigger={['click']} placement="bottomRight">
                    <div>
                      <Badge count={unreadNotifCount} size="small" color="#3b82f6" offset={[-2, 2]}>
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-500 hover:scale-105 transition-all duration-200 cursor-pointer"
                          title="Thông báo"
                        >
                          <Bell size={18} />
                        </button>
                      </Badge>
                    </div>
                  </Dropdown>

                  {/* Message/Chat Icon */}
                  <Badge count={unreadChatCount} size="small" color="#0ea5e9" offset={[-2, 2]}>
                    <button
                      onClick={() => navigate('/chat')}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                      title="Tin nhắn"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </Badge>

                  <div className="w-[1px] h-6 bg-slate-200 mx-1" />

                  {/* Avatar Dropdown */}
                  <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
                    <div className="flex items-center gap-3 cursor-pointer p-1 hover:bg-slate-50 rounded-2xl transition-all">
                      {user?.avatarUrl ? (
                        <Avatar 
                          size={40} 
                          src={user?.avatarUrl} 
                          className="border-2 border-white shadow-md shadow-slate-200" 
                        />
                      ) : (
                        <Avatar
                          size={40}
                          className="bg-emerald-600 border-2 border-white shadow-md shadow-slate-200 text-white font-extrabold flex items-center justify-center text-sm"
                        >
                          {user?.fullName?.charAt(0).toUpperCase() || 'Đ'}
                        </Avatar>
                      )}
                      <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="text-[13px] font-bold text-slate-900">{user?.fullName || 'Thành viên'}</span>
                        <span className="text-[10px] font-bold text-brand-green uppercase mt-1">Hội viên VIP</span>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-[14px] font-bold text-slate-600 hover:text-brand-green whitespace-nowrap transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                   <AppButton
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/partner')}
                    className="hidden lg:flex rounded-xl px-4 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 mr-2 whitespace-nowrap"
                  >
                    Dành cho chủ sân
                  </AppButton>
                  <AppButton
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/venues')}
                    className="rounded-xl px-6 font-extrabold shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                  >
                    Đặt sân ngay
                  </AppButton>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-100 mt-4">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'px-4 py-3 text-sm font-bold rounded-xl transition-all',
                        isActive ? 'text-brand-green bg-emerald-50' : 'text-slate-600',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ══ Main content ════════════════════════════════════════ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ══ SmashMate AI Chatbot ══════════════════════════════════ */}
      <SmashMateChatbot />

      {/* ══ Footer Professional ═════════════════════════════════ */}
      {!['/chat', '/map'].includes(location.pathname) && (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
          <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
              
              {/* Brand Section */}
              <div className="lg:col-span-4 space-y-6">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                    🏸
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">
                    Badminton<span className="text-brand-green">Hub</span>
                  </span>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Nền tảng đặt sân và kết nối cộng đồng cầu lông hàng đầu Việt Nam. Chúng tôi mang đến trải nghiệm chơi thể thao chuyên nghiệp và hiện đại nhất.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all"><FacebookFilled style={{ fontSize: 20 }} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all"><InstagramFilled style={{ fontSize: 20 }} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all"><YoutubeFilled style={{ fontSize: 20 }} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all"><TwitterCircleFilled style={{ fontSize: 20 }} /></a>
                </div>
              </div>

              {/* Links Sections */}
              <div className="lg:col-span-2 space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Nền tảng</h4>
                <ul className="space-y-4 text-sm">
                  {FOOTER_LINKS.platform.map(link => (
                    <li key={link.label}><Link to={link.to} className="hover:text-brand-green transition-colors">{link.label}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Hỗ trợ</h4>
                <ul className="space-y-4 text-sm">
                  {FOOTER_LINKS.support.map(link => (
                    <li key={link.label}><Link to={link.to} className="hover:text-brand-green transition-colors">{link.label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Newsletter / Contact */}
              <div className="lg:col-span-4 space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Kết nối với chúng tôi</h4>
                <ul className="space-y-4 text-sm">
                  {FOOTER_LINKS.contact.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-brand-green mt-1">{item.icon}</span>
                      <span className="text-slate-400">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-brand-green">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase leading-none mb-1">Coming soon</p>
                      <p className="text-sm font-bold text-white">Tải Mobile App</p>
                    </div>
                    <Button size="small" type="primary" className="ml-auto rounded-lg text-xs font-bold" ghost>Khám phá</Button>
                  </div>
                </div>
              </div>

            </div>

            <Divider className="border-slate-800 my-12" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
              <p>© 2026 BadmintonHub. All rights reserved.</p>
              <div className="flex items-center gap-8 font-medium">
                <Link to="/terms" className="hover:text-brand-green transition-colors">Điều khoản</Link>
                <Link to="/privacy" className="hover:text-brand-green transition-colors">Bảo mật</Link>
                <Link to="/cookies" className="hover:text-brand-green transition-colors">Cookies</Link>
                <button className="flex items-center gap-2 hover:text-white transition-colors">
                  <ExternalLink size={14} /> Tiếng Việt
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
