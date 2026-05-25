import { useEffect, useMemo, useState, useRef } from 'react';
import { Card, Tabs, Tag, Button, Typography, Space, Avatar, Badge, Empty, Modal, message, Spin } from 'antd';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
} from 'lucide-react';
import {
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';
import { communityApi } from '../../services/communityApi';
import type { MatchPost } from '../../types/community.types';
import { useAuthStore } from '../../stores/authStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function UserChallengesPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchPost[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const hasLoadedRef = useRef(false);

  const loadMyMatches = async () => {
    setLoading(true);
    try {
      const response = await communityApi.getMyMatches({ page: 0, size: 100 });
      setMatches(response.content || []);
    } catch (error) {
      message.error('Không thể tải kèo của tôi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadMyMatches();
  }, []);

  const upcomingMatches = useMemo(() => matches.filter((m) => m.status === 'OPEN'), [matches]);
  const historyMatches = useMemo(() => matches.filter((m) => m.status !== 'OPEN'), [matches]);

  const handleCancelMatch = (matchId: string) => {
    confirm({
      title: 'Xác nhận hủy kèo đấu?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Lưu ý: Hành động này không thể hoàn tác. Các thành viên đã tham gia sẽ nhận được thông báo hủy.',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Quay lại',
      centered: true,
      onOk() {
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              await communityApi.closeMatch(matchId);
              setMatches((prev) => prev.filter((m) => m.id !== matchId));
              message.success('Đã hủy kèo đấu thành công');
            } catch {
              message.error('Không thể hủy kèo');
            }
            resolve(null);
          }, 300);
        });
      },
    });
  };

  const renderMatchItem = (match: MatchPost) => (
    <Card
      key={match.id}
      className="mb-4 shadow-app-sm hover:shadow-app-md transition-all duration-300 border-none overflow-hidden animate-in fade-in slide-in-from-right-4"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className={`w-1.5 ${match.status === 'OPEN' ? 'bg-brand-green' : 'bg-amber-400'}`} />

        <div className="flex-1 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Title level={5} style={{ marginBottom: 4 }}>{match.title}</Title>
              <Tag color={match.status === 'OPEN' ? 'success' : 'default'} className="rounded-full border-none px-3 font-bold">
                {match.status === 'OPEN' ? 'Đang tìm đối' : match.status}
              </Tag>
              <Tag icon={<Trophy size={12} className="inline mr-1" />} className="rounded-full border-none bg-gray-100 font-medium">{match.level || 'Chưa rõ'}</Tag>
            </div>
            <div className="text-right">
              <Text strong style={{ color: BRAND.primary, fontSize: '18px' }}>Chia sẻ tiền sân</Text>
              <div className="flex items-center justify-end mt-1 text-app-muted">
                <Users size={14} className="mr-1" />
                <Text className="text-sm font-bold text-gray-500">{match.currentParticipants}/{match.maxParticipants} người</Text>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center text-app-muted">
              <MapPin size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{match.venueName || match.venueAddress || 'Chưa có địa điểm'}</Text>
            </div>
            <div className="flex items-center text-app-muted">
              <Calendar size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{dayjs(match.startTime).format('DD/MM/YYYY')}</Text>
            </div>
            <div className="flex items-center text-app-muted">
              <Clock size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{dayjs(match.startTime).format('HH:mm')} - {dayjs(match.endTime).format('HH:mm')}</Text>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Space>
              <Avatar size="small" style={{ backgroundColor: BRAND.primary }} className="shadow-sm">{(match.hostName || user?.fullName || 'U').charAt(0)}</Avatar>
              <Text type="secondary" className="text-sm">Chủ kèo: <Text strong className="text-gray-700">{match.hostName || user?.fullName || 'Bạn'}</Text></Text>
            </Space>
            <Space>
              <Button
                size="small"
                className="rounded-lg font-bold border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                onClick={() => navigate(`/community/matches/${match.id}`)}
              >
                Chi tiết
              </Button>
              <Button
                type="primary"
                size="small"
                ghost
                danger
                className="rounded-lg font-bold"
                onClick={() => handleCancelMatch(match.id)}
              >
                Hủy kèo
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Kèo của tôi</Title>
          <Text type="secondary" className="text-base">Quản lý các trận đấu bạn đã tham gia hoặc tạo</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="h-12 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all"
          onClick={() => navigate('/user/challenges/create')}
        >
          Tạo kèo mới
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="app-tabs"
        items={[
          {
            key: 'upcoming',
            label: (
              <span className="flex items-center gap-2 px-2">
                <ClockCircleOutlined /> Sắp tới
                <Badge count={upcomingMatches.length} style={{ backgroundColor: BRAND.primary }} className="ml-1" />
              </span>
            ),
            children: (
              <div className="mt-4">
                <Spin spinning={loading}>
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map(renderMatchItem)
                  ) : (
                    <Empty
                      style={{ marginTop: 60 }}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Bạn không còn kèo đấu nào sắp tới"
                    />
                  )}
                </Spin>
              </div>
            )
          },
          {
            key: 'history',
            label: (
              <span className="flex items-center gap-2 px-2">
                <CheckCircleOutlined /> Lịch sử
              </span>
            ),
            children: (
              <div className="mt-4">
                <Spin spinning={loading}>
                  {historyMatches.length > 0 ? (
                    historyMatches.map(renderMatchItem)
                  ) : (
                    <Empty
                      style={{ marginTop: 60 }}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Bạn chưa có lịch sử kèo đấu nào"
                    />
                  )}
                </Spin>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

