import type { ThemeConfig } from 'antd';

/**
 * SmashMate — Ant Design Theme Token
 * Nguồn token duy nhất cho toàn bộ ứng dụng.
 * Chỉnh sửa tại đây để thay đổi visual trên tất cả màn hình.
 */
export const smashMateTheme: ThemeConfig = {
  token: {
    // Brand colors
    colorPrimary: '#16a34a',       // green-600 — màu chính SmashMate
    colorSuccess: '#16a34a',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0ea5e9',

    // Typography
    fontFamily: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,

    // Surfaces
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorTextBase: '#0f172a',
    colorTextSecondary: '#64748b',

    // Borders & Radius
    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusSM: 6,
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',

    // Shadows
    boxShadow:
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

    // Motion
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },

  components: {
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 600,
      borderRadius: 10,
      borderRadiusLG: 12,
      primaryShadow: '0 4px 14px 0 rgba(22,163,74,0.35)',
    },

    Input: {
      controlHeight: 42,
      controlHeightLG: 48,
      borderRadius: 10,
      paddingInline: 14,
    },

    Select: {
      controlHeight: 42,
      controlHeightLG: 48,
      borderRadius: 10,
    },

    DatePicker: {
      controlHeight: 42,
      controlHeightLG: 48,
      borderRadius: 10,
    },

    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
      boxShadowTertiary:
        '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
    },

    Modal: {
      borderRadiusLG: 20,
    },

    Form: {
      labelFontSize: 14,
      labelColor: '#374151',
    },

    Tag: {
      borderRadius: 6,
      fontSizeSM: 12,
    },

    Tabs: {
      inkBarColor: '#16a34a',
      itemActiveColor: '#16a34a',
      itemSelectedColor: '#16a34a',
      itemHoverColor: '#15803d',
    },

    Steps: {
      colorPrimary: '#16a34a',
    },

    Progress: {
      defaultColor: '#16a34a',
    },

    Badge: {
      colorBgContainer: '#16a34a',
    },

    Alert: {
      borderRadius: 10,
    },

    Segmented: {
      borderRadius: 10,
      itemSelectedBg: '#ffffff',
      itemSelectedColor: '#16a34a',
    },
  },
};

/** Màu brand tập trung để dùng inline khi cần */
export const BRAND = {
  primary: '#16a34a',
  primaryLight: '#dcfce7',
  primaryDark: '#15803d',
  sky: '#0ea5e9',
  skyLight: '#e0f2fe',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#ffffff',
  bg: '#f8fafc',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
} as const;
