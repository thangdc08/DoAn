import { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Space, Avatar } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  MoreOutlined,
  UserOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockBookings } from '../../data/mockBookings';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

const REVENUE_DATA = [
  { name: 'Thứ 2', total: 1200000 },
  { name: 'Thứ 3', total: 1800000 },
  { name: 'Thứ 4', total: 1500000 },
  { name: 'Thứ 5', total: 2200000 },
  { name: 'Thứ 6', total: 3100000 },
  { name: 'Thứ 7', total: 4500000 },
  { name: 'Chủ Nhật', total: 5200000 },
];

export default function OwnerDashboardPage() {
  const stats = useMemo(() => {
    const paid = mockBookings.filter(b => b.status === 'PAID');
    return {
      revenue: paid.reduce((sum, b) => sum + b.totalAmount, 0),
      bookings: paid.length,
      venues: 3,
      growth: 12.5
    };
  }, []);

  const columns = [
    {
      title: 'Booking',
      key: 'booking',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={40} icon={<UserOutlined />} style={{ background: '#f1f5f9', color: '#64748b' }} />
          <div>
            <Text strong>#{record.id.substring(0, 6).toUpperCase()}</Text>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Khách hàng #{record.userId.substring(0, 4)}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Sân',
      dataIndex: 'venueNameSnapshot',
      key: 'venue',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#94a3b8' }} />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'time',
      render: (date: string) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>19:00 - 21:00</Text>
        </div>
      )
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: BRAND.primary }}>{amount.toLocaleString()}đ</Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PAID' ? 'success' : 'warning'} style={{ borderRadius: 6, fontWeight: 600 }}>
          {status === 'PAID' ? 'Đã thanh toán' : 'Chờ xử lý'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Tổng quan Dashboard</Title>
          <Text type="secondary">Chào mừng quay trở lại! Đây là tình hình kinh doanh của bạn hôm nay.</Text>
        </div>
        <Space>
          <Button icon={<CalendarOutlined />}>Tùy chỉnh ngày</Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ background: BRAND.primary, borderRadius: 10 }}>Thêm sân mới</Button>
        </Space>
      </div>

      {/* Stats Grid */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,166,81,0.1)', color: BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <DollarOutlined />
              </div>
              <Tag color="success" icon={<ArrowUpOutlined />}>12%</Tag>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" strong>Tổng doanh thu</Text>
              <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800 }}>{stats.revenue.toLocaleString()}đ</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,91,172,0.1)', color: BRAND.sky, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <CalendarOutlined />
              </div>
              <Tag color="processing" icon={<ArrowUpOutlined />}>8%</Tag>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" strong>Số lượng Booking</Text>
              <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800 }}>{stats.bookings}</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(114,46,209,0.1)', color: '#722ed1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <CheckCircleOutlined />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" strong>Cơ sở hoạt động</Text>
              <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800 }}>{stats.venues}</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(250,140,22,0.1)', color: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <ClockCircleOutlined />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" strong>Chờ xác nhận</Text>
              <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800 }}>{mockBookings.filter(b => b.status === 'PENDING').length}</Title>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Chart */}
        <Col xs={24} lg={16}>
          <Card 
            title="Biểu đồ doanh thu tuần qua" 
            extra={<Button type="text" icon={<MoreOutlined />} />}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <div style={{ height: 350, width: '100%', marginTop: 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="total" stroke={BRAND.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Recent Bookings */}
        <Col xs={24} lg={8}>
          <Card 
            title="Booking mới nhất" 
            extra={<Button type="link" style={{ fontWeight: 700 }}>Xem tất cả</Button>}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              {mockBookings.slice(0, 5).map(booking => (
                <div key={booking.id} style={{ display: 'flex', gap: 12 }}>
                  <Avatar style={{ background: '#E6F7EF', color: BRAND.primary }}>{booking.userId.charAt(0).toUpperCase()}</Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>Khách hàng #{booking.userId.substring(0, 4)}</Text>
                      <Text strong style={{ color: BRAND.primary }}>+{booking.totalAmount.toLocaleString()}đ</Text>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {dayjs(booking.createdAt).format('HH:mm')} · {booking.venueNameSnapshot}
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Table */}
        <Col span={24}>
          <Card 
            title="Danh sách giao dịch gần đây" 
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table
              columns={columns}
              dataSource={mockBookings.slice(0, 6)}
              rowKey="id"
              pagination={false}
              className="custom-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
