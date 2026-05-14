import { useState } from 'react';
import { Card, Tabs, List, Tag, Button, Typography, Space, Avatar, Badge, Empty, Modal, message } from 'antd';
import { 
  Swords, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { 
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function UserChallengesPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const [matches, setMatches] = useState([
    {
      id: 1,
      title: 'Kèo giao lưu trình độ B - B+',
      venue: 'Sân Cầu Lông Kỳ Hòa',
      date: '15/05/2026',
      time: '18:00 - 20:00',
      level: 'Trung bình khá',
      joined: 3,
      total: 4,
      status: 'CONFIRMED',
      price: '50.000đ',
      host: 'Minh Tuấn'
    },
    {
      id: 2,
      title: 'Tìm 1 bạn nam ghép đôi tập luyện',
      venue: 'Sân Cầu Lông Lan Anh',
      date: '17/05/2026',
      time: '20:00 - 22:00',
      level: 'Yếu - Trung bình',
      joined: 1,
      total: 2,
      status: 'PENDING',
      price: 'Chia sẻ tiền sân',
      host: 'Thanh Hằng'
    }
  ]);

  const handleCancelMatch = (matchId: number) => {
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
          setTimeout(() => {
            setMatches(prev => prev.filter(m => m.id !== matchId));
            message.success('Đã hủy kèo đấu thành công');
            resolve(null);
          }, 1000);
        });
      },
    });
  };

  const renderMatchItem = (match: any) => (
    <Card 
      key={match.id}
      className="mb-4 shadow-app-sm hover:shadow-app-md transition-all duration-300 border-none overflow-hidden animate-in fade-in slide-in-from-right-4"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left Color Bar */}
        <div className={`w-1.5 ${match.status === 'CONFIRMED' ? 'bg-brand-green' : 'bg-amber-400'}`} />
        
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Title level={5} style={{ marginBottom: 4 }}>{match.title}</Title>
              <Tag color={match.status === 'CONFIRMED' ? 'success' : 'processing'} className="rounded-full border-none px-3 font-bold">
                {match.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang tìm đối'}
              </Tag>
              <Tag icon={<Trophy size={12} className="inline mr-1" />} className="rounded-full border-none bg-gray-100 font-medium">{match.level}</Tag>
            </div>
            <div className="text-right">
              <Text strong style={{ color: BRAND.primary, fontSize: '18px' }}>{match.price}</Text>
              <div className="flex items-center justify-end mt-1 text-app-muted">
                <Users size={14} className="mr-1" />
                <Text className="text-sm font-bold text-gray-500">{match.joined}/{match.total} người</Text>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center text-app-muted">
              <MapPin size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{match.venue}</Text>
            </div>
            <div className="flex items-center text-app-muted">
              <Calendar size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{match.date}</Text>
            </div>
            <div className="flex items-center text-app-muted">
              <Clock size={16} className="mr-2 text-brand-green" />
              <Text className="text-sm font-medium">{match.time}</Text>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Space>
              <Avatar size="small" style={{ backgroundColor: BRAND.primary }} className="shadow-sm">{match.host.charAt(0)}</Avatar>
              <Text type="secondary" className="text-sm">Chủ kèo: <Text strong className="text-gray-700">{match.host}</Text></Text>
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
                <Badge count={matches.length} style={{ backgroundColor: BRAND.primary }} className="ml-1" />
              </span>
            ),
            children: (
              <div className="mt-4">
                {matches.length > 0 ? (
                  matches.map(renderMatchItem)
                ) : (
                  <Empty 
                    style={{ marginTop: 60 }}
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description="Bạn không còn kèo đấu nào sắp tới" 
                  />
                )}
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
              <Empty 
                style={{ marginTop: 60 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="Bạn chưa có lịch sử kèo đấu nào" 
              />
            )
          }
        ]}
      />
    </div>
  );
}

