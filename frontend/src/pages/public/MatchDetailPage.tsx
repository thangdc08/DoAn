import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Avatar, 
  Tag, 
  Divider, 
  List, 
  message, 
  Empty,
  Tooltip,
  Breadcrumb,
  Badge
} from 'antd';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  Trophy, 
  Info, 
  User, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Share2,
  AlertCircle,
  Zap,
  DollarSign,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { mockMatchPosts } from '../../data/mockCommunity';
import { useAuthStore } from '../../stores/authStore';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text, Paragraph } = Typography;

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulation loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const match = mockMatchPosts.find(m => m.id === matchId);

  if (!match) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-gray-300" />
        </div>
        <Title level={3} className="!mb-2 text-gray-800">Không tìm thấy kèo đấu</Title>
        <Text type="secondary" className="text-lg block mb-8 max-w-md">
          Có thể kèo này đã bị xóa hoặc đường dẫn không chính xác.
        </Text>
        <Button 
          type="primary" 
          size="large" 
          icon={<ChevronLeft size={18} />} 
          onClick={() => navigate('/community')}
          className="h-12 px-8 rounded-xl font-bold"
        >
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
    const map: any = {
      'BEGINNER': 'green',
      'INTERMEDIATE': 'blue',
      'ADVANCED': 'orange',
      'PROFESSIONAL': 'red',
      'ANY': 'purple'
    };
    return map[level] || 'default';
  };

  const getLevelLabel = (level: string) => {
    const map: any = {
      'BEGINNER': 'Mới chơi',
      'INTERMEDIATE': 'Trung bình',
      'ADVANCED': 'Khá - Giỏi',
      'PROFESSIONAL': 'Chuyên nghiệp',
      'ANY': 'Mọi trình độ'
    };
    return map[level] || level;
  };

  const participants = [
    { id: 'p1', name: 'Trần Hùng', level: 'INTERMEDIATE', status: 'APPROVED', avatar: 'https://i.pravatar.cc/150?img=11', joinedAt: '2 giờ trước' },
    { id: 'p2', name: 'Lê Lan', level: 'BEGINNER', status: 'PENDING', avatar: 'https://i.pravatar.cc/150?img=12', joinedAt: '30 phút trước' },
    { id: 'p3', name: 'Nguyễn Nam', level: 'ADVANCED', status: 'APPROVED', avatar: 'https://i.pravatar.cc/150?img=13', joinedAt: '1 ngày trước' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700 bg-[#f8fafc]">
      {/* Top Header & Breadcrumb */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumb 
          className="text-sm font-medium"
          items={[
            { title: <a onClick={() => navigate('/community')} className="text-gray-400 hover:text-brand-primary flex items-center gap-1"><Users size={14}/> Cộng đồng</a> },
            { title: <span className="text-gray-800">Chi tiết kèo đấu</span> }
          ]}
        />
        <div className="flex items-center gap-3">
          <Button 
            icon={<Share2 size={18} />} 
            className="rounded-xl border-gray-200 hover:text-brand-primary hover:border-brand-primary flex items-center justify-center h-10 px-4"
          >
            Chia sẻ
          </Button>
          <Button 
            icon={<ChevronLeft size={18} />} 
            onClick={() => navigate(-1)}
            className="rounded-xl bg-white border-gray-200 shadow-sm flex items-center justify-center h-10 w-10 p-0"
          />
        </div>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          {/* Main Info Section */}
          <div className="space-y-8">
            <Card 
              bordered={false} 
              className="shadow-2xl rounded-[2rem] overflow-hidden border border-white"
              bodyStyle={{ padding: 0 }}
            >
              {/* Hero Banner Section */}
              <div className="relative p-8 md:p-12 overflow-hidden bg-white">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                      <ShieldCheck size={12} /> {getLevelLabel(match.level)}
                    </span>
                    <span className="px-4 py-1.5 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                      <Zap size={12} /> {match.status === 'OPEN' ? 'Đang tuyển' : 'Đã đóng'}
                    </span>
                  </div>

                  <Title level={1} className="!mb-8 !text-4xl md:!text-5xl lg:!text-6xl font-black !tracking-tight text-slate-900 leading-[1.1]">
                    {match.title}
                  </Title>

                  <div className="flex flex-wrap gap-4 md:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-green shadow-inner">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <Text type="secondary" className="text-[10px] uppercase font-black tracking-widest block mb-0.5">Địa điểm</Text>
                        <Text strong className="text-slate-800 text-sm md:text-base">{match.venueName || 'Sân cầu lông'}</Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-green shadow-inner">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <Text type="secondary" className="text-[10px] uppercase font-black tracking-widest block mb-0.5">Ngày chơi</Text>
                        <Text strong className="text-slate-800 text-sm md:text-base">{dayjs(match.matchDate).format('DD/MM/YYYY')}</Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-green shadow-inner">
                        <Clock size={22} />
                      </div>
                      <div>
                        <Text type="secondary" className="text-[10px] uppercase font-black tracking-widest block mb-0.5">Thời gian</Text>
                        <Text strong className="text-slate-800 text-sm md:text-base">{match.startTime} - {match.endTime}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Content */}
              <div className="p-8 md:p-12 bg-[#fafbfc] border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                    <Info size={20} className="text-brand-primary" />
                  </div>
                  <Title level={4} className="!mb-0 font-black tracking-tight">Chi tiết kèo</Title>
                </div>
                <Paragraph className="text-lg leading-[1.8] text-slate-600 font-medium mb-0 max-w-3xl">
                  {match.description || 'Chủ kèo rất nhiệt tình nhưng chưa kịp viết mô tả. Bạn có thể nhắn tin trực tiếp để trao đổi thêm nhé!'}
                </Paragraph>
              </div>
            </Card>

            {/* Map Integration Card */}
            <Card 
              bordered={false} 
              className="shadow-xl rounded-[2rem] overflow-hidden border border-white"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-green/10 rounded-lg">
                    <Navigation size={20} className="text-brand-green" />
                  </div>
                  <Title level={4} className="!mb-0 font-black tracking-tight">Vị trí sân</Title>
                </div>
                <Button 
                  type="link" 
                  icon={<ExternalLink size={16} />} 
                  className="font-bold text-brand-primary flex items-center gap-1"
                >
                  Mở Google Maps
                </Button>
              </div>
              <div className="relative h-80 w-full bg-slate-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232427344!2d106.6641!3d10.7766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752edc00000001%3A0x6e288d6c8b9c8b9c!2zU8OibiBD4bqndSBMw7RuZyBL4buzIEjDsmE!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center justify-between">
                    <div>
                      <Text strong className="block text-slate-900">{match.venueName || 'Sân Kỳ Hòa'}</Text>
                      <Text className="text-xs text-slate-500">{match.location || 'Q.10, TP. Hồ Chí Minh'}</Text>
                    </div>
                    <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
                      <Navigation size={18} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Participants Section */}
            <Card 
              bordered={false} 
              className="shadow-xl rounded-[2rem] border border-white overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users size={20} className="text-blue-500" />
                  </div>
                  <Title level={4} className="!mb-0 font-black tracking-tight">Thành viên tham gia</Title>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full border border-blue-100">
                    {match.currentParticipants}/{match.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((p) => (
                  <div key={p.id} className="group p-5 bg-white border border-slate-100 rounded-3xl hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar size={56} src={p.avatar} className="border-2 border-white shadow-md" />
                          <div className="absolute -bottom-1 -right-1 bg-brand-green p-1 rounded-full border-2 border-white shadow-sm">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Text strong className="text-slate-900 text-base">{p.name}</Text>
                            <Badge status="success" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{getLevelLabel(p.level)}</span>
                            <span className="text-[10px] text-slate-400">Tham gia {p.joinedAt}</span>
                          </div>
                        </div>
                      </div>
                      {isOwner && p.status === 'PENDING' ? (
                        <Space>
                          <Button shape="circle" icon={<CheckCircle2 size={18} className="text-brand-green" />} className="border-brand-green/20 hover:bg-brand-green/5" />
                          <Button shape="circle" icon={<XCircle size={18} className="text-red-400" />} className="border-red-100 hover:bg-red-50" />
                        </Space>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <Award size={18} className={p.level === 'ADVANCED' ? 'text-amber-500' : 'text-slate-200'} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="sticky top-8 space-y-6">
            {/* Booking Action Card */}
            <Card 
              bordered={false} 
              className="shadow-2xl rounded-[2.5rem] border border-white overflow-hidden bg-white group"
              bodyStyle={{ padding: 0 }}
            >
              <div className="bg-brand-primary p-8 text-white relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_80%)]" />
                <Zap className="mx-auto mb-4 text-white/40 animate-pulse" size={40} />
                <Title level={3} className="!text-white !mb-1 font-black !tracking-widest uppercase">Tham gia</Title>
                <Text className="text-white/80 text-sm font-bold block">Còn {match.maxParticipants - match.currentParticipants} chỗ trống</Text>
              </div>
              
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center">
                      <DollarSign size={22} />
                    </div>
                    <Text type="secondary" className="font-bold">Chi phí</Text>
                  </div>
                  <Text className="text-2xl font-black text-slate-900">50K <span className="text-xs font-normal text-slate-400">/ người</span></Text>
                </div>

                <Space direction="vertical" size={16} className="w-full">
                  {isOwner ? (
                    <Button type="primary" size="large" block disabled className="h-16 rounded-2xl font-black text-lg grayscale opacity-50 border-none">
                      BẠN LÀ CHỦ KÈO
                    </Button>
                  ) : isJoined ? (
                    <Button type="primary" size="large" block disabled className="h-16 rounded-2xl font-black text-lg bg-slate-100 border-none text-slate-400">
                      ĐÃ GỬI YÊU CẦU
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="h-16 rounded-2xl font-black text-lg shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:translate-y-[-2px] transition-all duration-300"
                      onClick={handleJoin}
                      disabled={match.status !== 'OPEN' || match.currentParticipants >= match.maxParticipants}
                    >
                      ĐĂNG KÝ NGAY
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    <Button icon={<MessageSquare size={18} />} className="flex-1 h-14 rounded-2xl font-black text-slate-600 border-slate-200 hover:border-brand-primary hover:text-brand-primary flex items-center justify-center">
                      CHAT
                    </Button>
                    <Button icon={<Navigation size={18} />} className="flex-1 h-14 rounded-2xl font-black text-slate-600 border-slate-200 hover:border-brand-primary hover:text-brand-primary flex items-center justify-center">
                      CHỈ ĐƯỜNG
                    </Button>
                  </div>
                </Space>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-slate-400 text-xs italic leading-relaxed">
                    <AlertCircle size={16} className="shrink-0 text-amber-500" />
                    <span>Lưu ý: Bạn nên hủy đăng ký trước ít nhất 2 giờ nếu không thể tham gia.</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Host Card */}
            <Card bordered={false} className="shadow-xl rounded-[2rem] border border-white p-8 group">
              <Text type="secondary" className="text-[10px] uppercase font-black tracking-widest block mb-6 text-center">Người tổ chức</Text>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar size={96} src={match.userAvatar} className="border-4 border-white shadow-xl group-hover:scale-105 transition-all" />
                  <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-2xl shadow-lg border border-slate-50">
                    <Trophy size={20} className="text-amber-500" />
                  </div>
                </div>
                <Title level={4} className="!mb-1 font-black">{match.userName}</Title>
                <Text type="secondary" className="text-xs mb-6">Thành viên tâm huyết từ 2024</Text>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <Text className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tin cậy</Text>
                    <Text strong className="text-brand-green">98%</Text>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <Text className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Trình độ</Text>
                    <Text strong className="text-brand-primary">{getLevelLabel(match.userLevel || 'ANY')}</Text>
                  </div>
                </div>

                <Button block className="h-12 rounded-xl border-slate-200 font-bold hover:border-brand-primary hover:text-brand-primary">
                  XEM CHI TIẾT HỒ SƠ
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}



