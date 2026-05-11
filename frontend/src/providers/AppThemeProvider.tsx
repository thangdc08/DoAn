import React from 'react';
import { App, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { antdTokens } from '../styles/theme';

/**
 * AppThemeProvider — bọc toàn bộ app với Ant Design ConfigProvider.
 * Thiết lập token design, locale tiếng Việt và App wrapper (cần cho useApp() hooks).
 *
 * Đặt ở root App.tsx để áp dụng cho tất cả component Ant Design.
 */
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary:  antdTokens.colorPrimary,
          colorInfo:     antdTokens.colorInfo,
          colorSuccess:  antdTokens.colorSuccess,
          colorWarning:  antdTokens.colorWarning,
          colorError:    antdTokens.colorError,
          borderRadius:  antdTokens.borderRadius,
          fontFamily:    antdTokens.fontFamily,

          // Surfaces
          colorBgBase:        '#FFFFFF',
          colorBgLayout:      '#F7FAFC',
          colorBgContainer:   '#FFFFFF',
          colorTextBase:      '#0F172A',
          colorTextSecondary: '#64748B',
          colorBorder:        '#E2E8F0',

          // Motion
          motionDurationMid:  '0.2s',
          motionDurationSlow: '0.3s',
        },
        components: {
          Button: {
            controlHeight:   40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            fontWeight:      600,
            borderRadius:    10,
            borderRadiusLG:  12,
            primaryShadow:   '0 4px 12px rgba(0,166,81,0.30)',
          },
          Input: {
            controlHeight:   44,
            controlHeightLG: 48,
            borderRadius:    10,
            paddingInline:   14,
          },
          Select: {
            controlHeight:   44,
            controlHeightLG: 48,
            borderRadius:    10,
          },
          DatePicker: {
            controlHeight:   44,
            controlHeightLG: 48,
            borderRadius:    10,
          },
          Card: {
            borderRadiusLG: 14,
            paddingLG:      24,
          },
          Modal: {
            borderRadiusLG: 18,
          },
          Form: {
            labelFontSize: 14,
            labelColor:    '#374151',
          },
          Tag: {
            borderRadius: 6,
          },
          Tabs: {
            inkBarColor:     '#00A651',
            itemActiveColor: '#00A651',
            itemSelectedColor: '#00A651',
          },
          Steps: {
            colorPrimary: '#00A651',
          },
          Segmented: {
            borderRadius:    10,
            itemSelectedBg:  '#FFFFFF',
            itemSelectedColor: '#00A651',
          },
          Table: {
            borderRadius:   10,
            headerBg:       '#F7FAFC',
            headerColor:    '#0F172A',
          },
          Alert: {
            borderRadius: 10,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};

export default AppThemeProvider;
