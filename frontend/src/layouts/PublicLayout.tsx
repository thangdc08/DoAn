import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { AppButton } from '../components/ui/AppButton';
import {
  Menu, X, Search, User, Mail, Phone, MapPin, ExternalLink, Smartphone
} from 'lucide-react';
import { 
  FacebookFilled, 
  InstagramFilled, 
  TwitterCircleFilled, 
  YoutubeFilled 
} from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/authApi';
import { Avatar, Divider, Button, Typography, Dropdown, type MenuProps } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined, CalendarOutlined, ShopOutlined, DashboardOutlined } from '@ant-design/icons';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

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
              <div className="hidden xl:flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 focus-within:border-brand-green/30 focus-within:bg-white transition-all">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="bg-transparent border-none focus:ring-0 text-sm px-2 w-28 placeholder:text-slate-400 font-medium"
                />
              </div>

              {isAuthenticated ? (
                <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
                  <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-2xl transition-all">
                    <Avatar 
                      size={40} 
                      src={user?.avatarUrl} 
                      className="border-2 border-white shadow-md shadow-slate-200" 
                      icon={<UserOutlined />} 
                    />
                    <div className="hidden md:flex flex-col items-start leading-none">
                      <span className="text-[13px] font-bold text-slate-900">{user?.fullName || 'Thành viên'}</span>
                      <span className="text-[10px] font-bold text-brand-green uppercase mt-1">Hội viên VIP</span>
                    </div>
                  </div>
                </Dropdown>
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

      {/* ══ Footer Professional ═════════════════════════════════ */}
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
    </div>
  );
};

export default PublicLayout;
