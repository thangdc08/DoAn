import { Row, Col, Card, Typography, List, Avatar, Tag, Button, Empty, Space, Tooltip } from 'antd';
import { 
  TrophyOutlined, 
  CalendarOutlined, 
  FireOutlined, 
  ArrowRightOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  TeamOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

// Mock data for charts
const performanceData = [
  { name: 'Thứ 2', matches: 1 },
  { name: 'Thứ 3', matches: 3 },
  { name: 'Thứ 4', matches: 2 },
  { name: 'Thứ 5', matches: 5 },
  { name: 'Thứ 6', matches: 4 },
  { name: 'Thứ 7', matches: 8 },
  { name: 'Chủ nhật', matches: 6 },
];

const winRateData = [
  { name: 'Thắng', value: 65, color: BRAND.primary },
  { name: 'Thua', value: 35, color: '#ff4d4f' },
];

export default function UserDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const stats = [
    { title: 'Tổng trận đấu', value: 124, suffix: 'trận', icon: <FireOutlined />, gradient: 'from-orange-500 to-red-500', trend: '+12% so với tháng trước' },
    { title: 'Tỉ lệ thắng', value: 65, suffix: '%', icon: <TrophyOutlined />, gradient: 'from-yellow-400 to-amber-600', trend: 'Tăng 5% trong tuần này' },
    { title: 'Điểm uy tín', value: 985, suffix: 'pts', icon: <ThunderboltOutlined />, gradient: 'from-green-400 to-emerald-600', trend: 'Top 5% người chơi' },
    { title: 'Cấp độ', value: 'B+', suffix: '', icon: <RiseOutlined />, gradient: 'from-blue-500 to-indigo-600', trend: 'Sắp lên cấp A-' },
  ];

  const upcomingActivities = [
    { id: 1, type: 'MATCH', title: 'Giao lưu trình B+', time: 'Hôm nay, 18:00', location: 'Sân Cầu Lông Kỳ Hòa', status: 'CONFIRMED' },
    { id: 2, type: 'BOOKING', title: 'Đặt sân cố định', time: 'Thứ 7, 20:00', location: 'Sân Cầu Lông Lan Anh', status: 'PENDING' },
    { id: 3, type: 'MATCH', title: 'Giải nội bộ CLB', time: 'Chủ nhật, 08:00', location: 'Sân Cầu Lông Tân Bình', status: 'CONFIRMED' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 p-2 md:p-4">
      
      {/* Header & Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">Bảng điều khiển</Title>
          <Text type="secondary" className="text-lg">Chào mừng trở lại, <Text strong className="text-brand-green">{user?.fullName}</Text>! Bạn đã sẵn sàng cho những trận cầu hôm nay chưa?</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<CalendarOutlined />} 
          className="h-12 px-8 rounded-xl shadow-lg shadow-brand-green/20 font-bold"
          onClick={() => navigate('/venues')}
        >
          Đặt sân ngay
        </Button>
      </div>

      {/* Modern Stats Grid */}
      <Row gutter={[20, 20]} className="mb-8">
        {stats.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card bordered={false} className="relative overflow-hidden shadow-app-sm hover:shadow-app-md transition-all duration-300 rounded-2xl p-0 h-full">
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  <Tooltip title={stat.trend}>
                    <InfoCircleOutlined className="text-gray-300 hover:text-brand-green cursor-help" />
                  </Tooltip>
                </div>
                <Text type="secondary" className="text-sm font-medium uppercase tracking-wider">{stat.title}</Text>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-app-text">{stat.value}</span>
                  <span className="text-lg text-app-muted font-bold">{stat.suffix}</span>
                </div>
                <div className="mt-3 flex items-center text-xs text-brand-green font-bold">
                   <RiseOutlined className="mr-1" /> {stat.trend.split(' ')[0]} {stat.trend.split(' ')[1]}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Performance Chart Column */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-brand-green rounded-full" />
                <span className="text-lg font-bold">Hiệu suất tuần này</span>
              </div>
            }
            className="shadow-app-sm border-none rounded-2xl overflow-hidden h-full"
            extra={<Tag color="green-preset" className="m-0">Tháng 5, 2026</Tag>}
          >
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  />
                  <ChartTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: BRAND.primary, fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="matches" 
                    stroke={BRAND.primary} 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorMatches)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar.Group>
                  <Avatar src="https://i.pravatar.cc/150?u=1" />
                  <Avatar src="https://i.pravatar.cc/150?u=2" />
                  <Avatar src="https://i.pravatar.cc/150?u=3" />
                  <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#f0f0f0', color: '#999' }} />
                </Avatar.Group>
                <Text type="secondary">Bạn đã chơi cùng <Text strong>24 đối thủ khác nhau</Text> trong tháng này.</Text>
              </div>
              <Button type="link" className="font-bold p-0">Xem báo cáo chi tiết</Button>
            </div>
          </Card>
        </Col>

        {/* Upcoming & Tips Column */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="text-lg font-bold">Lịch thi đấu & Booking</span>}
            className="shadow-app-sm border-none rounded-2xl mb-6"
            bodyStyle={{ padding: '0 20px 20px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingActivities}
              renderItem={(item) => (
                <div className="py-4 border-b border-gray-50 last:border-none group cursor-pointer">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all group-hover:scale-110 ${item.type === 'MATCH' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                      {item.type === 'MATCH' ? <Swords size={20} /> : <CalendarOutlined />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Text strong className="text-base leading-tight block mb-1">{item.title}</Text>
                        <Tag color={item.status === 'CONFIRMED' ? 'success' : 'warning'} className="m-0 rounded-full text-[10px]">
                          {item.status === 'CONFIRMED' ? 'Đã chốt' : 'Chờ xác nhận'}
                        </Tag>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Text type="secondary" className="text-xs flex items-center gap-1"><CalendarOutlined style={{ fontSize: 10 }} /> {item.time}</Text>
                        <Text type="secondary" className="text-xs flex items-center gap-1"><TeamOutlined style={{ fontSize: 10 }} /> {item.location.split(' ').at(-1)}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
            <Button block className="mt-4 rounded-xl h-10 font-bold border-brand-green text-brand-green">Xem tất cả lịch</Button>
          </Card>

          <Card 
            className="shadow-app-sm border-none rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <TrophyOutlined className="text-yellow-400 text-xl" />
              </div>
              <Title level={5} className="!text-white !mb-0">Thử thách mới!</Title>
            </div>
            <Text className="text-white/70 block mb-4">
              Có 3 kèo đấu mới gần khu vực <Text className="text-brand-green font-bold">Quận 1</Text> phù hợp với trình độ B+ của bạn.
            </Text>
            <Button block ghost className="border-white/20 text-white hover:!text-brand-green hover:!border-brand-green rounded-xl h-10 font-bold">
              Khám phá ngay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// Mock lucide icons for consistency since they are used in Layout
function Swords({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" y1="14" x2="9" y2="18" />
      <line x1="7" y1="17" x2="4" y2="20" />
      <line x1="3" y1="19" x2="5" y2="21" />
    </svg>
  );
}
