/**
 * SmashMate Design System — Theme Tokens
 * Nguồn token duy nhất cho toàn bộ ứng dụng.
 * Import từ file này khi cần dùng màu/khoảng cách trong JS/TS.
 */

export const colors = {
  // ── Brand ──────────────────────────────────────────────────
  primary:      '#00A651',
  primaryDark:  '#007A3D',
  primaryLight: '#E6F7EF',

  secondary:     '#005BAC',
  secondaryDark: '#003F7D',

  accentLime:   '#B6E900',
  accentOrange: '#FF7A00',

  // ── App surfaces ───────────────────────────────────────────
  background: '#F7FAFC',
  surface:    '#FFFFFF',

  // ── Text ───────────────────────────────────────────────────
  text:   '#0F172A',
  muted:  '#64748B',
  border: '#E2E8F0',

  // ── Semantic ───────────────────────────────────────────────
  success: '#22C55E',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',
  pending: '#A855F7',
} as const;

export const radius = {
  sm:  '6px',
  md:  '10px',
  lg:  '16px',
  app: '14px',
} as const;

export const shadow = {
  sm:  '0 2px 8px rgba(15, 23, 42, 0.06)',
  app: '0 8px 24px rgba(15, 23, 42, 0.08)',
  lg:  '0 16px 40px rgba(15, 23, 42, 0.12)',
} as const;

export const fontSize = {
  xs:   '11px',
  sm:   '13px',
  base: '14px',
  md:   '15px',
  lg:   '17px',
  xl:   '20px',
  '2xl': '24px',
  '3xl': '30px',
} as const;

export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '16px',
  lg:  '24px',
  xl:  '32px',
  '2xl': '48px',
} as const;

/** Ant Design ConfigProvider token */
export const antdTokens = {
  colorPrimary:  colors.primary,
  colorInfo:     colors.secondary,
  colorSuccess:  colors.success,
  colorWarning:  colors.accentOrange,
  colorError:    colors.error,
  borderRadius:  12,
  fontFamily:    '"Be Vietnam Pro", system-ui, sans-serif',
} as const;

/** Gradient strings */
export const gradients = {
  sport:      'linear-gradient(135deg, #007A3D 0%, #00A651 40%, #005BAC 100%)',
  sportLight: 'linear-gradient(135deg, #E6F7EF 0%, #EEF4FF 100%)',
  hero:       'linear-gradient(to bottom right, #0F2D1E, #14532D, #1E3A5F)',
  primaryBtn: 'linear-gradient(135deg, #00A651, #007A3D)',
  secondaryBtn: 'linear-gradient(135deg, #005BAC, #003F7D)',
} as const;

/** Token theme object — use this as the single import */
export const theme = { colors, radius, shadow, fontSize, spacing, gradients } as const;

export type ThemeColors = typeof colors;
export type ThemeRadius = typeof radius;
