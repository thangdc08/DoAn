import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

type PageContainerProps = {
  /** Tiêu đề trang (h2) */
  title?: React.ReactNode;
  /** Mô tả ngắn bên dưới tiêu đề */
  subtitle?: React.ReactNode;
  /** Nút/action đặt bên phải tiêu đề */
  extra?: React.ReactNode;
  children: React.ReactNode;
  /** Padding xung quanh content, mặc định 24px */
  padding?: number | string;
  className?: string;
};

/**
 * PageContainer — wrapper chuẩn cho mọi trang nội dung.
 * Cung cấp max-width, padding nhất quán và tiêu đề tùy chọn.
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  extra,
  children,
  padding = '24px 32px',
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding,
        width: '100%',
      }}
    >
      {(title || extra) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {title && (
            <div>
              <Title level={2} style={{ margin: 0, lineHeight: 1.3 }}>
                {title}
              </Title>
              {subtitle && (
                <Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
                  {subtitle}
                </Text>
              )}
            </div>
          )}
          {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
