import { useEffect, useMemo, useState } from 'react';
import { Card, Tabs, Tag, Button, Typography, Space, Avatar, Badge, Empty, Modal, message, Spin } from 'antd';
import { Calendar, MapPin, Users, Clock, Trophy } from 'lucide-react';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';
import { communityApi } from '../../services/communityApi';
import type { MatchPost } from '../../types/community.types';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function UserChallengesPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchPost[]>([]);
  const navigate = useNavigate();

  const loadMyMatches = async () => {
    setLoading(true);
    try {
      const data = await communityApi.getMyMatches({ page: 0, size: 50 });
      setMatches(data.content || []);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Khong the tai danh sach keo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyMatches();
  }, []);

  const { upcomingMatches, historyMatches } = useMemo(() => {
    const now = dayjs();
    return {
      upcomingMatches: matches.filter((m) => dayjs(m.startTime).isAfter(now) && m.status !== 'CANCELLED'),
      historyMatches: matches.filter((m) => dayjs(m.startTime).isBefore(now) || m.status === 'CANCELLED' || m.status === 'FINISHED'),
    };
  }, [matches]);

  const handleCancelMatch = (matchId: string) => {
    confirm({
      title: 'Xac nhan dong keo?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Keo se duoc dong va khong hien thi de dang ky nua.',
      okText: 'Dong keo',
      okType: 'danger',
      cancelText: 'Quay lai',
      centered: true,
      async onOk() {
        try {
          await communityApi.closeMatch(matchId);
          message.success('Da dong keo thanh cong');
          await loadMyMatches();
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Khong the dong keo');
        }
      },
    });
  };

  const renderMatchItem = (match: MatchPost) => (
    <Card key={match.id} className="mb-4" bodyStyle={{ padding: 16 }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <Title level={5} style={{ marginBottom: 4 }}>{match.title}</Title>
          <Tag color={match.status === 'OPEN' ? 'success' : 'default'}>{match.status}</Tag>
          <Tag icon={<Trophy size={12} className="inline mr-1" />}>{match.level}</Tag>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mt-1 text-app-muted">
            <Users size={14} className="mr-1" />
            <Text className="text-sm font-bold text-gray-500">{match.currentParticipants}/{match.maxParticipants} nguoi</Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-app-muted">
          <MapPin size={16} className="mr-2 text-brand-green" />
          <Text className="text-sm font-medium">{match.venueName || match.venueAddress || '-'}</Text>
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
          <Avatar size="small" style={{ backgroundColor: BRAND.primary }}>{(match.hostName || 'U').charAt(0)}</Avatar>
          <Text type="secondary" className="text-sm">Chu keo: <Text strong className="text-gray-700">{match.hostName || 'Ban'}</Text></Text>
        </Space>
        <Space>
          <Button size="small" onClick={() => navigate(`/community/matches/${match.id}`)}>Chi tiet</Button>
          {match.status === 'OPEN' && (
            <Button type="primary" size="small" ghost danger onClick={() => handleCancelMatch(match.id)}>
              Dong keo
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Keo cua toi</Title>
          <Text type="secondary" className="text-base">Quan ly keo da tao va lich su</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/user/challenges/create')}>
          Tao keo moi
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'upcoming',
            label: (
              <span className="flex items-center gap-2 px-2">
                <ClockCircleOutlined /> Sap toi
                <Badge count={upcomingMatches.length} style={{ backgroundColor: BRAND.primary }} className="ml-1" />
              </span>
            ),
            children: <div className="mt-4">{upcomingMatches.length > 0 ? upcomingMatches.map(renderMatchItem) : <Empty description="Khong co keo sap toi" />}</div>,
          },
          {
            key: 'history',
            label: (
              <span className="flex items-center gap-2 px-2">
                <CheckCircleOutlined /> Lich su
              </span>
            ),
            children: <div className="mt-4">{historyMatches.length > 0 ? historyMatches.map(renderMatchItem) : <Empty description="Chua co lich su keo" />}</div>,
          },
        ]}
      />
    </div>
  );
}
