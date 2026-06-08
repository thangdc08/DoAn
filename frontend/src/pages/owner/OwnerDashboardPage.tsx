import { useMemo } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Space, Statistic, Spin } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  MoreOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BRAND } from '../../theme/antdTheme';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Đã thanh toán', color: 'success' },
  PENDING: { label: 'Chờ xử lý', color: 'warning' },
  FAILED: { label: 'Thất bại', color: 'error' },
  EXPIRED: { label: 'Hết hạn', color: 'default' },
  CANCELLED_BY_ADMIN: { label: 'Đã huỷ', color: 'default' },
};

export default function OwnerDashboardPage() {
  const { data: venues = [] } = useQuery({
    queryKey: ['my-venues'],
    queryFn: () => venueApi.getMyVenues(),
  });

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['owner-revenue'],
    queryFn: () => bookingApi.getRevenue(),
  });

  const { data: recentBookingsPage } = useQuery({
    queryKey: ['owner-bookings-recent'],
    queryFn: () => bookingApi.getOwnerBookings({ page: 0, size: 6 }),
  });

  // Fetch courts per venue to count total courts
  const { data: courtsPerVenue = [] } = useQuery({
    queryKey: ['all-venue-courts', venues.map(v => v.id).join(',')],
    queryFn: async () => {
      if (!venues.length) return [];
      const results = await Promise.all(
        venues.map(v =>
          venueApi.getVenueCourts(v.id)
            .then(courts => ({ venueId: v.id, courts }))
            .catch(() => ({ venueId: v.id, courts: [] }))
        )
      );
      return results;
    },
    enabled: venues.length > 0,
  });

  const totalCourts = courtsPerVenue.reduce((sum, v) => sum + v.courts.length, 0);
  const courtCountMap = Object.fromEntries(courtsPerVenue.map(v => [v.venueId, v.courts.length]));

  const recentBookings = recentBookingsPage?.content ?? [];

  const chartData = useMemo(() => {
    if (!revenue?.dailyBreakdown?.length) return [];
    return revenue.dailyBreakdown.slice(-7).map(d => ({
      name: dayjs(d.date).format('DD/MM'),
      revenue: d.revenue,
      bookings: d.bookingCount,
    }));
  }, [revenue]);

  const bookingStatusChartData = useMemo(() => {
    if (!revenue) return [];
    return [
      { name: 'Thành công', value: revenue.paidBookings, fill: '#52c41a' },
      { name: 'Chờ xử lý', value: revenue.pendingBookings, fill: '#faad14' },
      { name: 'Thất bại', value: revenue.failedBookings, fill: '#ff4d4f' },
    ];
  }, [revenue]);

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: revenue?.totalRevenue ?? 0,
      suffix: 'đ',
      icon: <DollarOutlined />,
      iconBg: 'rgba(0,166,81,0.1)',
      iconColor: BRAND.primary,
      formatter: (v: number) => v.toLocaleString('vi-VN'),
    },
    {
      title: 'Tổng booking',
      value: revenue?.totalBookings ?? 0,
      icon: <CalendarOutlined />,
      iconBg: 'rgba(0,91,172,0.1)',
      iconColor: BRAND.sky,
    },
    {
      title: 'Đặt thành công',
      value: revenue?.paidBookings ?? 0,
      icon: <CheckCircleOutlined />,
      iconBg: 'rgba(82,196,26,0.1)',
      iconColor: '#52c41a',
    },
    {
      title: 'Chờ xử lý',
      value: revenue?.pendingBookings ?? 0,
      icon: <ClockCircleOutlined />,
      iconBg: 'rgba(250,173,20,0.1)',
      iconColor: '#faad14',
    },
    {
      title: 'Đặt thất bại',
      value: revenue?.failedBookings ?? 0,
      icon: <CloseCircleOutlined />,
      iconBg: 'rgba(255,77,79,0.1)',
      iconColor: '#ff4d4f',
    },
    {
      title: 'Cơ sở',
      value: venues.length,
      icon: <AppstoreOutlined />,
      iconBg: 'rgba(114,46,209,0.1)',
      iconColor: '#722ed1',
    },
    {
      title: 'Tổng số sân',
      value: totalCourts,
      icon: <AppstoreOutlined />,
      iconBg: 'rgba(24,144,255,0.1)',
      iconColor: '#1890ff',
    },
  ];

  const columns = [
    {
      title: 'Mã booking',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>#{id.substring(0, 8).toUpperCase()}</Text>,
    },
    {
      title: 'Sân / Địa điểm',
      dataIndex: 'venueNameSnapshot',
      key: 'venue',
      render: (name: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          {record.items?.[0] && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.items[0].courtNameSnapshot} · {dayjs(record.items[0].startTime).format('HH:mm')} - {dayjs(record.items[0].endTime).format('HH:mm')}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: BRAND.primary }}>{amount.toLocaleString('vi-VN')}đ</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'default' };
        return <Tag color={cfg.color} style={{ borderRadius: 6, fontWeight: 600 }}>{cfg.label}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Tổng quan Dashboard</Title>
          <Text type="secondary">Chào mừng quay trở lại! Đây là tình hình kinh doanh của bạn.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: BRAND.primary, borderRadius: 10 }}>
          Thêm sân mới
        </Button>
      </div>

      {/* Stats Grid */}
      <Spin spinning={revenueLoading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map((s) => (
            <Col xs={24} sm={12} lg={Math.floor(24 / 4)} key={s.title} style={{ minWidth: 0 }}>
              <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{s.title}</Text>
                    <Statistic
                      value={s.value}
                      formatter={s.formatter ? (v) => s.formatter!(v as number) : undefined}
                      suffix={s.suffix}
                      valueStyle={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {/* Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card
            title="Doanh thu 7 ngày gần nhất"
            extra={<Button type="text" icon={<MoreOutlined />} />}
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={BRAND.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Booking Status Chart */}
        <Col xs={24} lg={8}>
          <Card
            title="Phân loại đặt sân"
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingStatusChartData} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${val} lượt`, 'Số booking']}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {bookingStatusChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 8 }}>
              {bookingStatusChartData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f8f9fa' }}>
                  <Space>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.fill }} />
                    <Text style={{ fontSize: 13 }}>{d.name}</Text>
                  </Space>
                  <Text strong>{d.value}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Venue Court Summary */}
      {venues.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Card
              title="Thông tin sân theo cơ sở"
              style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <Row gutter={[12, 12]}>
                {venues.map((venue) => (
                  <Col xs={24} sm={12} md={8} key={venue.id}>
                    <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text strong style={{ display: 'block', marginBottom: 2 }}>{venue.name}</Text>
                        <Tag color={venue.status === 'APPROVED' ? 'success' : 'warning'} style={{ borderRadius: 6, margin: 0 }}>
                          {venue.status === 'APPROVED' ? 'Hoạt động' : venue.status}
                        </Tag>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>{venue.address}</Text>
                      <Space>
                        <AppstoreOutlined style={{ color: '#1890ff' }} />
                        <Text style={{ fontSize: 13 }}>
                          <Text strong style={{ color: '#1890ff' }}>{courtCountMap[venue.id] ?? 0}</Text> sân
                        </Text>
                      </Space>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recent Bookings Table */}
      <Card
        title="Giao dịch gần đây"
        style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
      >
        <Table
          columns={columns}
          dataSource={recentBookings}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Chưa có giao dịch nào' }}
        />
      </Card>
    </div>
  );
}
