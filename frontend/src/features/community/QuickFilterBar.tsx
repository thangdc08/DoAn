import React from 'react';
import { Tag, Typography } from 'antd';
import { colors } from '../../styles/theme';

const { Title } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────

export interface QuickTag {
  label: string;
  value: string;
}

export interface QuickFilterBarProps {
  tags: QuickTag[];
  activeValue: string | null;
  onChange: (value: string | null) => void;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * QuickFilterBar — bộ tag lọc nhanh cho Community feed.
 * Toggle chọn/bỏ chọn, chỉ cho phép 1 tag active tại một thời điểm.
 *
 * @example
 * <QuickFilterBar
 *   tags={QUICK_TAGS}
 *   activeValue={activeTag}
 *   onChange={setActiveTag}
 * />
 */
export const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  tags,
  activeValue,
  onChange,
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 14,
      padding: 20,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    }}
  >
    <Title level={5} style={{ margin: '0 0 12px', fontWeight: 700 }}>
      Lọc nhanh
    </Title>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((tag) => {
        const isActive = activeValue === tag.value;
        return (
          <Tag.CheckableTag
            key={tag.value}
            checked={isActive}
            onChange={() => onChange(isActive ? null : tag.value)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 13,
              border: `1px solid ${isActive ? colors.primary : '#e2e8f0'}`,
              background: isActive ? '#dcfce7' : '#f8fafc',
              color: isActive ? colors.primaryDark : '#475569',
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none',
            }}
          >
            {tag.label}
          </Tag.CheckableTag>
        );
      })}
    </div>
  </div>
);

export default QuickFilterBar;
