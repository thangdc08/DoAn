import React from 'react';
import { Button, Rate, Tag, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
import type { CourtResult } from '../../types/venue.types';
import { colors } from '../../styles/theme';

const { Text, Title } = Typography;

export interface VenueCardProps {
  court: CourtResult;
  selected: boolean;
  onClick: () => void;
  onNavigate: () => void;
}

/**
 * VenueCard — card hiển thị thông tin một sân trong sidebar danh sách.
 * Highlight khi được chọn, có nút "Xem" để vào trang chi tiết.
 *
 * @example
 * <VenueCard
 *   court={court}
 *   selected={selectedId === court.id}
 *   onClick={() => setSelectedId(court.id)}
 *   onNavigate={() => navigate(`/venues/${court.id}`)}
 * />
 */
export const VenueCard: React.FC<VenueCardProps> = ({
  court,
  selected,
  onClick,
  onNavigate,
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: '100%',
      textAlign: 'left',
      background: selected ? '#f0fdf4' : '#fff',
      border: `1.5px solid ${selected ? colors.primary : colors.border}`,
      borderRadius: 14,
      padding: '14px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: selected
        ? '0 4px 16px rgba(0,166,81,0.12)'
        : '0 1px 3px rgba(15,23,42,0.05)',
    }}
  >
    {/* Name + distance */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
      <Title
        level={5}
        style={{ margin: 0, fontWeight: 700, fontSize: 14, lineHeight: 1.4, flex: 1 }}
        ellipsis
      >
        {court.name}
      </Title>
      {court.distance && (
        <Text style={{ color: colors.secondary, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
          {court.distance}
        </Text>
      )}
    </div>

    {/* Address */}
    <Text
      type="secondary"
      style={{ fontSize: 12, lineHeight: 1.5, display: 'block', marginBottom: 8 }}
      ellipsis
    >
      {court.address}
    </Text>

    {/* Footer: rating + district + posts + action */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Rate
          disabled
          value={court.rating}
          allowHalf
          count={1}
          character={<StarFilled />}
          style={{ fontSize: 12 }}
        />
        <Text style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
          {court.rating}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          · {court.district}
        </Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {court.posts > 0 && (
          <Tag color="green" style={{ fontSize: 11, margin: 0, padding: '0 8px' }}>
            {court.posts} bài
          </Tag>
        )}
        <Button
          size="small"
          type={selected ? 'primary' : 'default'}
          onClick={(e) => { e.stopPropagation(); onNavigate(); }}
          style={{ fontSize: 11, borderRadius: 6, fontWeight: 600, height: 24 }}
        >
          Xem
        </Button>
      </div>
    </div>
  </button>
);

export default VenueCard;
