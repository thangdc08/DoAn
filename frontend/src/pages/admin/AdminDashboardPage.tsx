import { Card, Row, Col, Typography, Statistic, List, Avatar, Tag, Button, Space } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

const { Title, Text } = Typography;

const MOCK_STATS = [
  { title: 'Tổng người dùng', value: 1250, icon: <UserOutlined />, color: '#4f46e5', trend: '+12%' },
  { title: 'Cơ sở đăng ký', value: 48, icon: <ShopOutlined />, color: BRAND.primary, trend: '+5%' },
  { title: 'Doanh thu tháng', value: '158.4M', icon: <DollarOutlined />, color: '#0ea5e9', trend: '+18%' },
  { title: 'Đơn chờ duyệt', value: 5, icon: <ClockCircleOutlined />, color: '#f59e0b', trend: 'Cần xử lý' },
];

const RECENT_REGISTRATIONS = [
  { id: 1, name: 'Sân Cầu Lông Ngôi Sao', owner: 'Nguyễn Văn A', time: '10 phút trước', status: 'PENDING' },
  { id: 2, name: 'Badminton Center Q10', owner: 'Trần Thị B', time: '2 giờ trước', status: 'PENDING' },
  { id: 3, name: 'Sân Cầu Lông Đại Học', owner: 'Lê Văn C', time: '5 giờ trước', status: 'APPROVED' },
];

const CRITICAL_TICKETS = [
  { id: 'T-1001', subject: 'Lỗi thanh toán ngân hàng', owner: 'Phạm Văn D', priority: 'HIGH' },
  { id: 'T-1002', subject: 'Yêu cầu xóa tài khoản', owner: 'Hoàng Thị E', priority: 'MEDIUM' },
];

const REVENUE_DATA = [
  { name: 'Tháng 1', value: 45 },
  { name: 'Tháng 2', value: 52 },
  { name: 'Tháng 3', value: 48 },
  { name: 'Tháng 4', value: 70 },
  { name: 'Tháng 5', value: 85 },
  { name: 'Tháng 6', value: 105 },
  { name: 'Tháng 7', value: 158 },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 32 }}>
         <Title level={2} style={{ margin: 0 }}>Tổng quan Quản trị</Title>
         <Text type="secondary">Chào mừng trở lại! Dưới đây là tình hình hoạt động của toàn bộ nền tảng.</Text>
      </div>

      {/* Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {MOCK_STATS.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                 <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 16, 
                    background: `${stat.color}15`, 
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                 }}>
                    {stat.icon}
                 </div>
                 <div style={{ flex: 1 }}>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>{stat.title}</Text>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                       <Title level={3} style={{ margin: 0 }}>{stat.value}</Title>
                       <Text type="success" style={{ fontSize: 12 }}>{stat.trend}</Text>
                    </div>
                 </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24}>
        {/* Left Column: Recent Registrations */}
        <Col span={16}>
           <Card 
             title={<Space><FileSearchOutlined /> Phê duyệt cơ sở mới</Space>}
             extra={<Button type="link" onClick={() => navigate('/admin/venues')}>Xem tất cả</Button>}
             style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
           >
              <List
                itemLayout="horizontal"
                dataSource={RECENT_REGISTRATIONS}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      item.status === 'PENDING' ? (
                        <Space>
                           <Button size="small" type="primary" ghost>Xem hồ sơ</Button>
                           <Button size="small" type="primary" style={{ background: BRAND.primary }}>Duyệt</Button>
                        </Space>
                      ) : (
                        <Tag color="success" icon={<CheckCircleOutlined />}>Đã duyệt</Tag>
                      )
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<ShopOutlined />} style={{ background: '#f8fafc', color: BRAND.primary }} />}
                      title={<Text strong>{item.name}</Text>}
                      description={`Chủ sân: ${item.owner} • ${item.time}`}
                    />
                  </List.Item>
                )}
              />
           </Card>

           <Card 
             title={<Space><DollarOutlined /> Biểu đồ doanh thu hệ thống (Triệu VNĐ)</Space>}
             style={{ borderRadius: 20, marginTop: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
           >
              <div style={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={BRAND.primary} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </Col>

        {/* Right Column: Activity & Support */}
        <Col span={8}>
           <Card 
             title={<Space><MessageOutlined /> Hỗ trợ khẩn cấp</Space>}
             style={{ borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
           >
              <List
                dataSource={CRITICAL_TICKETS}
                renderItem={(item) => (
                  <div style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Tag color="red" style={{ fontSize: 10 }}>URGENT</Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>T-ID: {item.id}</Text>
                     </div>
                     <Text strong style={{ display: 'block', marginBottom: 4 }}>{item.subject}</Text>
                     <Text type="secondary" style={{ fontSize: 12 }}>Yêu cầu bởi: {item.owner}</Text>
                     <div style={{ marginTop: 8 }}>
                        <Button size="small" block icon={<MessageOutlined />} onClick={() => navigate('/admin/support')}>Phản hồi ngay</Button>
                     </div>
                  </div>
                )}
              />
           </Card>

           <Card 
             title={<Space><ClockCircleOutlined /> Hoạt động hệ thống</Space>}
             style={{ borderRadius: 20, marginTop: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
           >
              <List
                size="small"
                dataSource={[
                  'Cập nhật chính sách bảo mật hệ thống v2.1',
                  'Backup dữ liệu thành công lúc 02:00 AM',
                  'Phát hiện 2 tài khoản có dấu hiệu spam',
                  'Admin System đã phê duyệt 5 sân mới'
                ]}
                renderItem={(item) => (
                  <List.Item style={{ fontSize: 12, color: '#64748b' }}>
                    <Space><div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primary }} /> {item}</Space>
                  </List.Item>
                )}
              />
           </Card>
        </Col>
      </Row>
    </div>
  );
}
