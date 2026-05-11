import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { AppButton } from '../components/ui/AppButton';
import {
  Menu, X, Search,
} from 'lucide-react';

// ── Nav links ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: '/venues', label: 'Sân cầu lông' },
  { to: '/community', label: 'Tìm kèo' },
  { to: '/forum', label: 'Cộng đồng' },
];

// ── Component ─────────────────────────────────────────────────────────────

/**
 * PublicLayout — layout dùng cho public site (VenueList, Community, v.v.)
 * Header trắng cố định + main content + không có sidebar.
 */
export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-app-bg">
      {/* ══ Header ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-app-surface border-b border-app-border shadow-app-sm">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              to="/venues"
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center text-white text-lg font-black shadow-sm group-hover:bg-brand-green-dark transition-colors">
                🏸
              </div>
              <span className="text-xl font-black text-app-text tracking-tight">
                Badminton<span className="text-brand-green">Hub</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      'relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                      isActive
                        ? 'text-brand-green bg-brand-green-light'
                        : 'text-app-muted hover:text-app-text hover:bg-app-bg',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              {/* Search icon */}
              <button
                type="button"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search size={18} />
              </button>

              <AppButton
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
              >
                Đăng nhập
              </AppButton>

              <AppButton
                variant="primary"
                size="sm"
                onClick={() => navigate('/venues')}
              >
                Đặt sân ngay
              </AppButton>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-app-muted hover:bg-app-bg transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-app-border mt-1">
              <nav className="flex flex-col gap-1 pt-3">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors',
                        isActive
                          ? 'text-brand-green bg-brand-green-light'
                          : 'text-app-muted hover:text-app-text hover:bg-app-bg',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="flex gap-2 mt-2 px-1">
                  <AppButton variant="outline" size="sm" onClick={() => { navigate('/login'); setMenuOpen(false); }} className="flex-1">
                    Đăng nhập
                  </AppButton>
                  <AppButton variant="primary" size="sm" onClick={() => { navigate('/venues'); setMenuOpen(false); }} className="flex-1">
                    Đặt sân ngay
                  </AppButton>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ══ Main content ════════════════════════════════════════ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ══ Footer minimal ══════════════════════════════════════ */}
      <footer className="border-t border-app-border bg-app-surface">
        <div className="mx-auto max-w-screen-xl px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-app-muted">
          <span>© 2025 BadmintonHub. Nền tảng đặt sân cầu lông #1 Việt Nam.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-green transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-brand-green transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-brand-green transition-colors">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
