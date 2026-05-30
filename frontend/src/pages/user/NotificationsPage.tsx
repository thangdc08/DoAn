import { useEffect } from 'react';
import { Card, List, Typography, Button, Space, Tag, Empty, Badge, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useCommunityStore } from '../../stores/communityStore';
import type { Notification } from '../../types/notification.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, fetchNotifications } = useCommunityStore();

  useEffect(() => {
    fetchNotifications().catch(console.error);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      BOOKING_PAID: '✅',
      BOOKING_EXPIRED: '⏰',
      MATCH_JOIN_REQUESTED: '👥',
      MATCH_APPROVED: '✔️',
      MATCH_REJECTED: '❌',
      RATING_CREATED: '⭐',
      VENUE_APPROVED: '🏸',
      VENUE_REJECTED: '🚫',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      BOOKING_PAID: 'success',
      BOOKING_EXPIRED: 'warning',
      MATCH_JOIN_REQUESTED: 'processing',
      MATCH_APPROVED: 'success',
      MATCH_REJECTED: 'error',
      RATING_CREATED: 'gold',
      VENUE_APPROVED: 'success',
      VENUE_REJECTED: 'error',
    };
    return colors[type] || 'default';
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      message.success('Đã đánh dấu đã đọc');
    } catch {
      message.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      message.success('Đã đánh dấu tất cả đã đọc');
    } catch {
      message.error('Không thể đánh dấu tất cả đã đọc');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Title level={2}>Thông báo</Title>
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ backgroundColor: '#52c41a' }} />
          )}
        </Space>
        {unreadCount > 0 && (
          <Button icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Card>
        {notifications.length === 0 ? (
          <Empty description="Chưa có thông báo nào" />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification: Notification) => (
              <List.Item
                style={{
                  background: notification.readAt ? 'transparent' : '#f0f7ff',
                  padding: '16px',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                actions={[
                  !notification.readAt && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ fontSize: 32 }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong={!notification.readAt}>{notification.title}</Text>
                      <Tag color={getNotificationColor(notification.type)} style={{ fontSize: 10 }}>
                        {notification.type}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text>{notification.content}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(notification.createdAt).fromNow()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
