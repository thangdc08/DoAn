import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Modal, Tabs, Empty, Spin, message, Popconfirm, Avatar, Tag, Row, Col, Divider } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { communityApi } from '../../services/communityApi';
import type { MatchPost } from '../../types/community.types';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Sắp tới', color: 'blue' },
  CLOSED: { label: 'Đã kết thúc', color: 'default' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
  FINISHED: { label: 'Hoàn thành', color: 'green' },
};

const LEVEL_MAP: Record<string, string> = {
  Y: 'Y',
  'Y+': 'Y+',
  TBY: 'Trung bình yếu',
  'TBY+': 'Trung bình yếu+',
  'TB-': 'Trung bình-',
  TB: 'Trung bình',
  'TB+': 'Trung bình+',
  'TB++': 'Trung bình++',
  TBK: 'Trung bình khá',
};

interface MatchCardProps {
  match: MatchPost;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

function MatchCard({ match, onEdit, onDelete, onView }: MatchCardProps) {
  const statusConfig = STATUS_MAP[match.status] || { label: match.status, color: 'default' };
  const joinStatusLabel = match.joinMode === 'APPROVE' ? 'Chờ xác nhận' : 'Dạng tự do';
  const joinStatusColor = match.joinMode === 'APPROVE' ? 'orange' : 'green';

  return (
    <Card
      className="rounded-2xl border-l-4 hover:shadow-lg transition-all mb-4"
      style={{ borderLeftColor: statusConfig.label === 'Sắp tới' ? '#10b981' : '#d1d5db' }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-4">
        <Row gutter={[16, 16]}>
          {/* Left side - Status indicator */}
          <Col xs={24} sm={1}>
            <div className="flex items-center gap-2 sm:flex-col">
              {statusConfig.label === 'Sắp tới' ? (
                <CheckCircleOutlined style={{ fontSize: '20px', color: '#10b981' }} />
              ) : (
                <CloseCircleOutlined style={{ fontSize: '20px', color: '#6b7280' }} />
              )}
            </div>
          </Col>

          {/* Main content */}
          <Col xs={24} sm={16}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {/* Title and status */}
              <div className="flex items-start justify-between gap-4">
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: 0, marginBottom: '4px' }}>
                    {match.title}
                  </Title>
                  <Space size="small" wrap>
                    <Tag color={joinStatusColor}>{joinStatusLabel}</Tag>
                    <Tag color={LEVEL_MAP[match.level] ? 'purple' : 'default'}>
                      {LEVEL_MAP[match.level] || match.level}
                    </Tag>
                  </Space>
                </div>
              </div>

              {/* Location and venue */}
              <Space size="small" className="text-gray-600">
                <EnvironmentOutlined style={{ fontSize: '12px' }} />
                <Text className="text-sm">{match.location}</Text>
              </Space>

              {/* Date and time */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Space size="small" className="text-gray-600">
                    <CalendarOutlined style={{ fontSize: '12px' }} />
                    <Text className="text-sm">{dayjs(match.startTime).format('DD/MM/YYYY')}</Text>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space size="small" className="text-gray-600">
                    <ClockCircleOutlined style={{ fontSize: '12px' }} />
                    <Text className="text-sm">
                      {dayjs(match.startTime).format('HH:mm')} - {dayjs(match.endTime).format('HH:mm')}
                    </Text>
                  </Space>
                </Col>
              </Row>

              {/* Host info */}
              <Space size="small" className="text-gray-600">
                <Avatar size={20} style={{ backgroundColor: '#10b981' }}>
                  {match.hostName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Text className="text-sm">Chủ kèo: {match.hostName}</Text>
              </Space>
            </Space>
          </Col>

          {/* Right side - Stats and actions */}
          <Col xs={24} sm={7}>
            <Space direction="vertical" size={12} style={{ width: '100%' }} align="end">
              {/* Participants count */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <TeamOutlined style={{ fontSize: '16px', color: '#10b981' }} />
                  <Text strong className="text-base">{match.currentParticipants}/{match.maxParticipants}</Text>
                </div>
                <Text type="secondary" className="text-xs">người</Text>
              </div>

              {/* Fee */}
              {match.fee && (
                <div className="text-right">
                  <Text strong className="text-green-600" style={{ fontSize: '16px' }}>
                    {match.fee?.toLocaleString()}đ
                  </Text>
                  <div><Text type="secondary" className="text-xs">Phí tham gia</Text></div>
                </div>
              )}

              {/* Actions */}
              <Space size="small" style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  ghost
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => onView?.(match.id)}
                >
                  Chi tiết
                </Button>
                <Button
                  type="default"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.(match.id)}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa kèo"
                  description="Bạn chắc chắn muốn xóa kèo này?"
                  onConfirm={() => onDelete?.(match.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  );
}

export default function MyMatchesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [matches, setMatches] = useState<MatchPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [activeTab]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'upcoming' ? 'OPEN' : undefined;
      const response = await communityApi.getMyMatches({
        status,
        page: 0,
        size: 50,
      });
      setMatches(response.content || []);
    } catch (error) {
      message.error('Không thể tải danh sách kèo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = () => {
    navigate('/user/create-match');
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await communityApi.deleteMatchPost(id);
      message.success('Xóa kèo thành công');
      loadMatches();
    } catch (error) {
      message.error('Không thể xóa kèo');
    }
  };

  const handleEditMatch = (id: string) => {
    navigate(`/user/edit-match/${id}`);
  };

  const handleViewMatch = (id: string) => {
    navigate(`/matches/${id}`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={2} className="!mb-1">Kèo của tôi</Title>
          <Text type="secondary">Quản lý các trận đấu bạn đã tạo</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreateMatch}
          className="rounded-lg"
        >
          Tạo kèo mới
        </Button>
      </div>

      <Card className="shadow-app-sm border-none rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="px-6 pt-6"
          items={[
            {
              key: 'upcoming',
              label: (
                <span>
                  <ClockCircleOutlined />
                  Sắp tới ({matches.filter(m => m.status === 'OPEN').length})
                </span>
              ),
            },
            {
              key: 'history',
              label: (
                <span>
                  <CalendarOutlined />
                  Lịch sử ({matches.filter(m => m.status !== 'OPEN').length})
                </span>
              ),
            },
          ]}
        />

        <Divider style={{ margin: 0 }} />

        <div style={{ padding: '24px' }}>
          <Spin spinning={loading}>
            {matches.length === 0 ? (
              <Empty
                description="Không có kèo nào"
                style={{ padding: '40px 0' }}
              />
            ) : (
              <div>
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onView={handleViewMatch}
                    onEdit={handleEditMatch}
                    onDelete={handleDeleteMatch}
                  />
                ))}
              </div>
            )}
          </Spin>
        </div>
      </Card>
    </div>
  );
}
