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
  { key: '/venues', label: 'Sân Cầu Lông', icon: '🏟️' },
  { key: '/community', label: 'Tìm Kèo Giao Lưu', icon: '🤝' },
  { key: '/forum', label: 'Diễn Đàn', icon: '💬' },
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
      padding: '6px 18px',
      height: 40,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: active ? BRAND.primary : '#64748b',
      background: active ? 'rgba(22,163,74,0.06)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderRadius: 10,
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      if (!active) {
        el.style.color = '#1e293b';
        el.style.background = '#f1f5f9';
      }
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      if (!active) {
        el.style.color = '#64748b';
        el.style.background = 'transparent';
      }
    }}
  >
    {label}
    {active && (
      <span
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 3,
          borderRadius: 99,
          background: BRAND.primary,
          boxShadow: `0 2px 8px rgba(22,163,74,0.5)`,
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
          height: 68,
          padding: '0 32px',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid #e8f0e9',
          /* Grid 3 cột: left=1fr | center=auto | right=1fr */
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(15,23,42,0.07)',
        }}
      >
        {/* ── Col 1: Logo + Location (căn trái) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/venues')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px 4px 0',
              borderRadius: 12, transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.82'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <div
              style={{
                width: 38, height: 38, borderRadius: 11,
                background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 19, boxShadow: '0 3px 10px rgba(22,163,74,0.35)',
                flexShrink: 0,
              }}
            >
              🏸
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                Smash<span style={{ color: BRAND.primary }}>Mate</span>
              </div>
              <div style={{ fontSize: 8.5, fontWeight: 800, color: '#b0bec5', textTransform: 'uppercase', letterSpacing: '0.22em' }}>
                Badminton Hub
              </div>
            </div>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: '#e2e8f0', flexShrink: 0 }} className="hidden lg:block" />

          {/* Location chip */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '5px 13px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="hidden lg:flex"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#dcfce7';
              el.style.borderColor = '#86efac';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#f0fdf4';
              el.style.borderColor = '#bbf7d0';
            }}
          >
            <GlobalOutlined style={{ color: BRAND.primary, fontSize: 12 }} />
            <Text style={{ fontSize: 11.5, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Hà Nội
            </Text>
          </div>
        </div>

        {/* ── Col 2: Nav (căn giữa tuyệt đối) ── */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 2 }}
          className="hidden lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.key}
              label={item.label}
              active={location.pathname.startsWith(item.key)}
              onClick={() => navigate(item.key)}
            />
          ))}
        </nav>

        {/* ── Col 3: Actions + Profile (căn phải) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          {/* Search */}
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined style={{ fontSize: 16, color: '#64748b' }} />}
            style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />

          {/* Notifications */}
          <Badge count={3} size="small" color={BRAND.primary} offset={[-4, 4]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 16, color: '#64748b' }} />}
              style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          </Badge>

          {/* Divider */}
          <div style={{ width: 1, height: 26, background: '#e2e8f0', margin: '0 6px' }} />

          {/* User profile */}
          <Dropdown trigger={['click']} menu={{ items: userMenuItems }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 40, padding: '4px 12px 4px 4px',
                cursor: 'pointer', transition: 'all 0.22s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#fff';
                el.style.borderColor = BRAND.primary;
                el.style.boxShadow = `0 3px 12px rgba(22,163,74,0.18)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#f8fafc';
                el.style.borderColor = '#e2e8f0';
                el.style.boxShadow = 'none';
              }}
            >
              <Avatar
                size={30}
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=SmashMate"
                style={{ boxShadow: '0 2px 6px rgba(15,23,42,0.12)', flexShrink: 0 }}
              />
              <div className="hidden md:block" style={{ lineHeight: 1.2 }}>
                <Text strong style={{ fontSize: 12.5, color: '#0f172a', display: 'block', whiteSpace: 'nowrap' }}>
                  Thắng Đinh
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                    borderRadius: 4, padding: '1px 5px',
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      ✦ VIP
                    </Text>
                  </span>
                </div>
              </div>
            </div>
          </Dropdown>

          {/* Mobile menu button */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 16 }} />}
            onClick={() => setDrawerOpen(true)}
            style={{ marginLeft: 4 }}
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
