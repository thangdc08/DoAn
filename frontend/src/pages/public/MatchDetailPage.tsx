import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Space, Avatar, Tag, Divider, List, message, Empty } from 'antd';
import { UserOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, TeamOutlined, LeftOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { mockMatchPosts } from '../../data/mockCommunity';
import { useAuthStore } from '../../stores/authStore';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isJoined, setIsJoined] = useState(false);

  const match = mockMatchPosts.find(m => m.id === matchId);

  if (!match) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Empty description="Không tìm thấy kèo này" />
        <Button icon={<LeftOutlined />} onClick={() => navigate('/community')} style={{ marginTop: 16 }}>
          Quay lại cộng đồng
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === match.userId;

  const handleJoin = () => {
    if (!isAuthenticated) {
      message.info('Vui lòng đăng nhập để tham gia kèo');
      navigate('/login');
      return;
    }
    setIsJoined(true);
    message.success('Gửi yêu cầu tham gia thành công! Đang chờ chủ kèo duyệt.');
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'green',
      INTERMEDIATE: 'blue',
      ADVANCED: 'orange',
      PROFESSIONAL: 'red',
      ANY: 'default',
    };
    return colors[level] || 'default';
  };

  // Mock participants
  const participants = [
    { id: 'p1', name: 'Trần Hùng', level: 'INTERMEDIATE', status: 'APPROVED', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 'p2', name: 'Lê Lan', level: 'BEGINNER', status: 'PENDING', avatar: 'https://i.pravatar.cc/150?img=12' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Button icon={<LeftOutlined />} onClick={() => navigate('/community')} style={{ marginBottom: 24 }}>
        Quay lại
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Title level={2}>{match.title}</Title>
                <Space size="middle">
                  <Tag color={getLevelColor(match.level)}>Trình độ: {match.level}</Tag>
                  <Tag color={match.status === 'OPEN' ? 'success' : 'default'}>{match.status}</Tag>
                </Space>
              </div>
              <Avatar size={64} src={match.userAvatar} icon={<UserOutlined />} />
            </div>

            <Divider />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}><EnvironmentOutlined style={{ marginRight: 8 }} /> Địa điểm</Title>
                <Paragraph style={{ marginLeft: 24 }}>
                  {match.venueName ? <strong>{match.venueName}</strong> : match.location}
                  {match.venueName && match.location && <div style={{ color: '#8c8c8c' }}>{match.location}</div>}
                </Paragraph>
              </div>

              <Row gutter={24}>
                <Col span={12}>
                  <Title level={5}><CalendarOutlined style={{ marginRight: 8 }} /> Ngày chơi</Title>
                  <Paragraph style={{ marginLeft: 24 }}>
                    {dayjs(match.matchDate).format('DD/MM/YYYY')}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Title level={5}><ClockCircleOutlined style={{ marginRight: 8 }} /> Thời gian</Title>
                  <Paragraph style={{ marginLeft: 24 }}>
                    {match.startTime} - {match.endTime}
                  </Paragraph>
                </Col>
              </Row>

              <div>
                <Title level={5}><InfoCircleOutlined style={{ marginRight: 8 }} /> Mô tả</Title>
                <Paragraph style={{ marginLeft: 24, whiteSpace: 'pre-wrap' }}>
                  {match.description}
                </Paragraph>
              </div>
            </Space>
          </Card>

          {/* Participants section */}
          <Card title={<Space><TeamOutlined /> Danh sách tham gia ({match.currentParticipants}/{match.maxParticipants})</Space>} style={{ marginTop: 24, borderRadius: 16 }}>
            <List
              itemLayout="horizontal"
              dataSource={participants}
              renderItem={(p) => (
                <List.Item
                  actions={isOwner && p.status === 'PENDING' ? [
                    <Button type="primary" size="small" icon={<CheckCircleOutlined />} ghost>Duyệt</Button>,
                    <Button danger size="small" icon={<CloseCircleOutlined />} ghost>Từ chối</Button>
                  ] : []}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={p.avatar} />}
                    title={p.name}
                    description={
                      <Space>
                        <Tag>{p.level}</Tag>
                        <Tag color={p.status === 'APPROVED' ? 'green' : 'orange'}>
                          {p.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 16, textAlign: 'center', position: 'sticky', top: 24 }}>
            <Title level={4}>Bạn muốn tham gia?</Title>
            <Paragraph type="secondary">
              Hãy chắc chắn bạn có thể tham gia đúng giờ và đúng trình độ yêu cầu.
            </Paragraph>
            <Divider />
            {isOwner ? (
              <Button type="primary" size="large" block disabled>
                Bạn là chủ kèo
              </Button>
            ) : isJoined ? (
              <Button type="default" size="large" block disabled icon={<CheckCircleOutlined />}>
                Đã gửi yêu cầu
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                block
                onClick={handleJoin}
                disabled={match.status !== 'OPEN' || match.currentParticipants >= match.maxParticipants}
              >
                {match.status === 'OPEN' ? 'Đăng ký tham gia' : 'Đã đủ người'}
              </Button>
            )}
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Mọi thắc mắc vui lòng liên hệ chủ kèo qua phần bình luận hoặc tin nhắn.
              </Text>
            </div>
          </Card>

          <Card title="Chủ kèo" style={{ marginTop: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={48} src={match.userAvatar} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{match.userName}</div>
                <Tag color={getLevelColor(match.userLevel || 'ANY')}>{match.userLevel}</Tag>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">Thành viên từ: 01/2024</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

