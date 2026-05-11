import React, { useState } from 'react';
import {
  Avatar, Badge, Button, Drawer, Dropdown, Layout, Typography,
} from 'antd';
import {
  BellOutlined, CalendarOutlined, GlobalOutlined, LogoutOutlined,
  MenuOutlined, SearchOutlined, SettingOutlined, UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';

const { Header, Content } = Layout;
const { Text } = Typography;

// ─── Nav items ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: '/venues', label: 'Sân cầu lông' },
  { key: '/community', label: 'Tìm kèo giao lưu' },
  { key: '/forum', label: 'Diễn đàn' },
];

// ─── Subcomponents ────────────────────────────────────────────────────────

type NavButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const NavButton: React.FC<NavButtonProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: active ? BRAND.primary : '#64748b',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s',
      borderRadius: 8,
    }}
    onMouseEnter={(e) => {
      if (!active) (e.currentTarget as HTMLElement).style.color = '#334155';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.currentTarget as HTMLElement).style.color = '#64748b';
    }}
  >
    {label}
    {active && (
      <span
        style={{
          position: 'absolute',
          bottom: -1,
          left: 16,
          right: 16,
          height: 3,
          borderRadius: 99,
          background: BRAND.primary,
          boxShadow: `0 2px 8px rgba(22,163,74,0.4)`,
        }}
      />
    )}
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Tài khoản của tôi' },
    { key: 'bookings', icon: <CalendarOutlined />, label: 'Đơn đặt sân' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: BRAND.bg }}>
      {/* ── Header ──────────────────────────────────── */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 72,
          padding: '0 32px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: '0 1px 8px rgba(15,23,42,0.06)',
        }}
      >
        {/* Left: Logo + Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/venues')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'transform 0.15s',
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
              }}
            >
              🏸
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                Smash<span style={{ color: BRAND.primary }}>Mate</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Badminton Hub
              </div>
            </div>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 32, background: '#e2e8f0' }} className="hidden lg:block" />

          {/* Location chip */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="hidden lg:flex"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
          >
            <GlobalOutlined style={{ color: BRAND.primary, fontSize: 13 }} />
            <Text style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hà Nội
            </Text>
          </div>
        </div>

        {/* Center: Main nav */}
        <nav style={{ display: 'flex', alignItems: 'center' }} className="hidden lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.key}
              label={item.label}
              active={location.pathname.startsWith(item.key)}
              onClick={() => navigate(item.key)}
            />
          ))}
        </nav>

        {/* Right: Actions + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined style={{ fontSize: 17, color: '#64748b' }} />}
            style={{ width: 36, height: 36 }}
          />

          <Badge count={3} size="small" color={BRAND.primary} offset={[-3, 3]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 17, color: '#64748b' }} />}
              style={{ width: 36, height: 36 }}
            />
          </Badge>

          <div style={{ width: 1, height: 28, background: '#e2e8f0', margin: '0 4px' }} />

          <Dropdown
            trigger={['click']}
            menu={{ items: userMenuItems }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 40, padding: '4px 14px 4px 4px',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#fff';
                el.style.borderColor = BRAND.primary;
                el.style.boxShadow = `0 4px 14px rgba(22,163,74,0.15)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#f8fafc';
                el.style.borderColor = '#e2e8f0';
                el.style.boxShadow = 'none';
              }}
            >
              <Avatar
                size={32}
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=SmashMate"
                style={{ boxShadow: '0 2px 6px rgba(15,23,42,0.12)' }}
              />
              <div className="hidden md:block" style={{ lineHeight: 1.2 }}>
                <Text strong style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>Thắng Đinh</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primary }} />
                  <Text style={{ fontSize: 10, fontWeight: 800, color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    VIP
                  </Text>
                </div>
              </div>
            </div>
          </Dropdown>

          {/* Mobile menu button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="flex lg:hidden"
          />
        </div>
      </Header>

      {/* Mobile Drawer nav */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🏸</span>
            <span style={{ fontWeight: 900 }}>SmashMate</span>
          </div>
        }
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={260}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.key}
              type={location.pathname.startsWith(item.key) ? 'primary' : 'text'}
              block
              style={{ textAlign: 'left', fontWeight: 700, height: 44 }}
              onClick={() => { navigate(item.key); setDrawerOpen(false); }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </Drawer>

      {/* Content */}
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
