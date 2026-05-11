import React from 'react';
import { Avatar, Divider, Typography } from 'antd';

const { Text, Title } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────

export interface ActivityItem {
  id: number;
  text: string;
  time: string;
  dot: string;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * ActivityFeed — sidebar widget hiển thị hoạt động gần đây của người dùng.
 *
 * @example
 * <ActivityFeed items={ACTIVITIES} />
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 14,
      padding: 20,
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
    }}
  >
    <Title level={5} style={{ margin: '0 0 14px', fontWeight: 700 }}>
      Hoạt động gần đây
    </Title>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((activity, idx) => (
        <React.Fragment key={activity.id}>
          <div style={{ display: 'flex', gap: 12, padding: '10px 0' }}>
            <Avatar
              size={32}
              style={{ background: '#f1f5f9', fontSize: 16, flexShrink: 0 }}
            >
              {activity.dot}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, lineHeight: 1.5, display: 'block' }}>
                {activity.text}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {activity.time}
              </Text>
            </div>
          </div>
          {idx < items.length - 1 && <Divider style={{ margin: 0 }} />}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default ActivityFeed;
