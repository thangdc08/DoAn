import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Button, Table, Tag, Select, Spin, Empty, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { 
  UserOutlined, 
  HomeOutlined, 
  TrophyOutlined, 
  LineChartOutlined, 
  GlobalOutlined, 
  DownloadOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BRAND } from '../../theme/antdTheme';
import { adminApi } from '../../services/adminApi';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminReportPage() {
  const [selectedVenueId, setSelectedVenueId] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<string>('30-days');

  // Compute dates based on time range
  const { startDate, endDate } = useMemo(() => {
    const today = dayjs();
    let start = today.subtract(30, 'day');
    
    if (timeRange === '7-days') {
      start = today.subtract(7, 'day');
    } else if (timeRange === 'this-month') {
      start = today.startOf('month');
    } else if (timeRange === 'this-year') {
      start = today.startOf('year');
    }
    
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD')
    };
  }, [timeRange]);

  // Fetch all venues in system for the filter dropdown
  const { data: systemVenues = [], isLoading: isLoadingVenues } = useQuery({
    queryKey: ['systemVenues'],
    queryFn: () => venueApi.getVenues({ size: 1000 })
  });

  // Fetch admin revenue stats
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['adminRevenue', selectedVenueId, startDate, endDate],
    queryFn: () => bookingApi.getAdminRevenue({
      venueId: selectedVenueId === 'ALL' ? undefined : selectedVenueId,
      startDate,
      endDate
    })
  });

  // Fetch total users for top cards
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsersCount'],
    queryFn: () => adminApi.getUsers({ page: 0, size: 1 })
  });

  const totalUsers = usersData?.totalElements || 0;
  const totalVenuesCount = systemVenues.length;

  const isLoading = isLoadingVenues || isLoadingRevenue || isLoadingUsers;

  // Format daily data for Recharts
  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown || revenueData.dailyBreakdown.length === 0) {
      return [];
    }
    return revenueData.dailyBreakdown.map(item => ({
      date: dayjs(item.date).format('DD/MM'),
      revenue: item.revenue,
      bookings: item.bookingCount
    }));
  }, [revenueData]);

  // Table columns
  const tableColumns = useMemo(() => {
    if (selectedVenueId === 'ALL') {
      // Show breakdown by venue
      return [
        { 
          title: 'Tên sân / Cơ sở', 
          dataIndex: 'venueName', 
          key: 'venueName', 
          render: (text: string) => <Text strong>{text || 'Không xác định'}</Text> 
        },
        { 
          title: 'Số lượng Booking', 
          dataIndex: 'bookingCount', 
          key: 'bookingCount', 
          align: 'center' as const 
        },
        { 
          title: 'Tổng doanh thu', 
          dataIndex: 'revenue', 
          key: 'revenue', 
          align: 'right' as const,
          render: (val: number) => <Text strong style={{ color: BRAND.primary }}>{Number(val).toLocaleString()}đ</Text> 
        },
        { 
          title: 'Đóng đóng góp', 
          key: 'ratio', 
          align: 'center' as const,
          render: (_: any, record: any) => {
            const total = revenueData?.totalRevenue || 1;
            const percentage = Math.round((record.revenue / total) * 100);
            return (
              <Tag color={percentage > 25 ? 'success' : 'processing'} style={{ borderRadius: 4 }}>
                {percentage}%
              </Tag>
            );
          } 
        },
      ];
    } else {
      // Show breakdown by day
      return [
        { 
          title: 'Ngày', 
          dataIndex: 'date', 
          key: 'date', 
          render: (text: string) => <Text strong>{dayjs(text).format('DD/MM/YYYY')}</Text> 
        },
        { 
          title: 'Số lượng Booking', 
          dataIndex: 'bookingCount', 
          key: 'bookingCount', 
          align: 'center' as const 
        },
        { 
          title: 'Doanh thu trong ngày', 
          dataIndex: 'revenue', 
          key: 'revenue', 
          align: 'right' as const,
          render: (val: number) => <Text strong style={{ color: BRAND.primary }}>{Number(val).toLocaleString()}đ</Text> 
        }
      ];
    }
  }, [selectedVenueId, revenueData]);

  // Export CSV helper
  const handleExport = () => {
    if (!revenueData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    if (selectedVenueId === 'ALL') {
      csvContent += "Ten San,So Luong Booking,Doanh Thu\n";
      revenueData.venueBreakdown.forEach(row => {
        csvContent += `"${row.venueName}",${row.bookingCount},${row.revenue}\n`;
      });
    } else {
      csvContent += "Ngay,So Luong Booking,Doanh Thu\n";
      revenueData.dailyBreakdown.forEach(row => {
        csvContent += `"${row.date}",${row.bookingCount},${row.revenue}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_doanh_thu_he_thong_${dayjs().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Spin spinning={isLoading} tip="Đang tải báo cáo hệ thống...">
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Báo cáo Hệ thống & Doanh thu</Title>
            <Text type="secondary">Phân tích tăng trưởng, hiệu suất toàn bộ nền tảng và doanh thu của từng sân.</Text>
          </div>
          <Space wrap>
            <Select 
              value={selectedVenueId} 
              onChange={setSelectedVenueId} 
              style={{ width: 220 }}
              placeholder="Lọc theo sân"
            >
              <Option value="ALL">Tất cả các cơ sở</Option>
              {systemVenues.map(v => (
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))}
            </Select>

            <Select value={timeRange} onChange={setTimeRange} style={{ width: 150 }}>
              <Option value="7-days">7 ngày qua</Option>
              <Option value="30-days">30 ngày qua</Option>
              <Option value="this-month">Tháng này</Option>
              <Option value="this-year">Năm nay</Option>
            </Select>

            <Button 
              icon={<DownloadOutlined />} 
              type="primary" 
              style={{ background: BRAND.primary }}
              onClick={handleExport}
              disabled={!revenueData}
            >
              Xuất báo cáo
            </Button>
          </Space>
        </div>

        {/* Top Stats */}
        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Statistic 
                title="Tổng doanh thu" 
                value={Number(revenueData?.totalRevenue || 0)} 
                suffix="đ" 
                prefix={<GlobalOutlined style={{ color: BRAND.primary }} />} 
                valueStyle={{ fontWeight: 800, color: BRAND.primary }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Statistic 
                title="Tổng lượt đặt (Bookings)" 
                value={revenueData?.totalBookings || 0} 
                prefix={<HomeOutlined style={{ color: BRAND.sky }} />} 
                valueStyle={{ fontWeight: 800 }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Statistic 
                title="Đặt sân thành công" 
                value={revenueData?.paidBookings || 0} 
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                valueStyle={{ fontWeight: 800, color: '#52c41a' }} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Statistic 
                title="Tổng người dùng" 
                value={totalUsers} 
                prefix={<UserOutlined style={{ color: '#722ed1' }} />} 
                valueStyle={{ fontWeight: 800 }} 
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          {/* Trend Line Chart */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <Space>
                  <LineChartOutlined style={{ color: BRAND.primary }} />
                  <span>Biểu đồ doanh thu hệ thống</span>
                </Space>
              }
              style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              {chartData.length === 0 ? (
                <Empty description="Không có dữ liệu doanh thu trong khoảng thời gian này" style={{ padding: '60px 0' }} />
              ) : (
                <div style={{ height: 350, width: '100%', marginTop: 20 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`}`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                        formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={BRAND.primary} 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: BRAND.primary, strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>

          {/* Platforms Overview stats */}
          <Col xs={24} lg={8}>
            <Card title="Phân bố trạng thái đặt sân" style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ padding: '20px 0' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={24}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text>Thành công (PAID)</Text>
                      <Text strong>{revenueData?.paidBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.paidBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${revenueData?.totalBookings ? (revenueData.paidBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#52c41a' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text>Chờ thanh toán (PENDING)</Text>
                      <Text strong>{revenueData?.pendingBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.pendingBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${revenueData?.totalBookings ? (revenueData.pendingBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#fa8c16' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text>Thất bại/Hủy (FAILED)</Text>
                      <Text strong>{revenueData?.failedBookings || 0} ({revenueData?.totalBookings ? Math.round((revenueData.failedBookings / revenueData.totalBookings) * 100) : 0}%)</Text>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${revenueData?.totalBookings ? (revenueData.failedBookings / revenueData.totalBookings) * 100 : 0}%`, height: '100%', background: '#f5222d' }} />
                    </div>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Detailed Data Table */}
          <Col span={24}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span>Chi tiết doanh thu của từng sân đấu</span>
                  <Tag color="cyan"><CalendarOutlined /> {startDate} đến {endDate}</Tag>
                </div>
              }
              style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <Table
                dataSource={selectedVenueId === 'ALL' ? (revenueData?.venueBreakdown || []) : (revenueData?.dailyBreakdown || [])}
                rowKey={selectedVenueId === 'ALL' ? 'venueId' : 'date'}
                columns={tableColumns}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                locale={{ emptyText: <Empty description="Không có số liệu giao dịch nào" /> }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
