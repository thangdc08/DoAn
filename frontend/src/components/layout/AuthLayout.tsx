import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';

const { Title, Paragraph } = Typography;

type FeatureBadge = {
  icon: string;
  label: string;
};

type AuthLayoutProps = {
  /** Tiêu đề lớn bên cột trái */
  heroTitle: string;
  /** Mô tả bên cột trái */
  heroSubtitle: string;
  /** Các badge feature hiển thị phía dưới */
  features?: FeatureBadge[];
  /** Form content bên cột phải */
  children: React.ReactNode;
  /** Chiều rộng cột phải (mặc định 480px) */
  panelWidth?: number;
};

/**
 * AuthLayout — layout dùng chung cho LoginPage và RegisterPage.
 * Sidebar xanh + panel trắng, loại bỏ duplicate code giữa 2 trang.
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  heroTitle,
  heroSubtitle,
  features = [],
  children,
  panelWidth = 480,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        minHeight: '100vh',
        gridTemplateColumns: `1fr ${panelWidth}px`,
        background: '#f8fafc',
      }}
      className="max-lg:grid-cols-1"
    >
      {/* ── Cột trái: Hero Sidebar ───────────────────────── */}
      <section
        style={{
          background: `linear-gradient(145deg, #0f2d1e 0%, #14532d 50%, #166534 100%)`,
          padding: '40px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(22,163,74,0.15)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -40,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Link
          to="/venues"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(22,163,74,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🏸
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.03em',
            }}
          >
            Smash<span style={{ color: '#4ade80' }}>Mate</span>
          </span>
        </Link>

        {/* Hero text */}
        <div style={{ maxWidth: 480 }}>
          <Title
            level={1}
            style={{
              color: '#fff',
              fontSize: 40,
              lineHeight: 1.2,
              fontWeight: 800,
              margin: 0,
            }}
          >
            {heroTitle}
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 17,
              marginTop: 16,
              lineHeight: 1.7,
            }}
          >
            {heroSubtitle}
          </Paragraph>
        </div>

        {/* Feature badges */}
        {features.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {features.map((f) => (
              <div
                key={f.label}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 10,
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Cột phải: Form Panel ──────────────────────────── */}
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          background: '#fff',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 32,
            }}
            className="flex lg:hidden"
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: BRAND.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🏸
            </div>
            <span
              style={{ fontSize: 20, fontWeight: 900, color: BRAND.text }}
            >
              Smash<span style={{ color: BRAND.primary }}>Mate</span>
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
