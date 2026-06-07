import { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Space, Button, Table, Tag, Select, Spin, Empty, DatePicker } from 'antd';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell
} from 'recharts';
import { 
  DownloadOutlined, 
  FilterOutlined, 
  ArrowUpOutlined, 
  DollarCircleOutlined,
  LineChartOutlined,
  CalendarOutlined,
  ShopOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { bookingApi } from '../../services/bookingApi';
import { venueApi } from '../../services/venueApi';

const { Title, Text } = Typography;
const { Option } = Select;

const CHART_COLORS = ['#00A651', '#005BAC', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2', '#fadb14'];

export default function OwnerRevenuePage() {
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

  // Fetch owner venues
  const { data: venues = [], isLoading: isLoadingVenues } = useQuery({
    queryKey: ['ownerVenues'],
    queryFn: () => venueApi.getMyVenues()
  });

  // Fetch revenue stats
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['ownerRevenue', selectedVenueId, startDate, endDate],
    queryFn: () => bookingApi.getRevenue({
      venueId: selectedVenueId === 'ALL' ? undefined : selectedVenueId,
      startDate,
      endDate
    })
  });

  const isLoading = isLoadingVenues || isLoadingRevenue;

  // Format daily data for Recharts
  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown || revenueData.dailyBreakdown.length === 0) {
      return [];
    }
    return revenueData.dailyBreakdown.map(item => ({
      date: dayjs(item.date).format('DD/MM'),
      revenue: item.revenue,
      count: item.bookingCount
    }));
  }, [revenueData]);

  // Format venue breakdown data for Recharts
  const venueChartData = useMemo(() => {
    if (!revenueData?.venueBreakdown || revenueData.venueBreakdown.length === 0) {
      return [];
    }
    return revenueData.venueBreakdown.map((item, index) => ({
      name: item.venueName || 'Không xác định',
      revenue: item.revenue,
      color: CHART_COLORS[index % CHART_COLORS.length]
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
          title: 'Doanh thu', 
          dataIndex: 'revenue', 
          key: 'revenue', 
          align: 'right' as const,
          render: (val: number) => <Text strong style={{ color: BRAND.primary }}>{Number(val).toLocaleString()}đ</Text> 
        },
        { 
          title: 'Tỷ lệ đóng góp', 
          key: 'ratio', 
          align: 'center' as const,
          render: (_: any, record: any) => {
            const total = revenueData?.totalRevenue || 1;
            const percentage = Math.round((record.revenue / total) * 100);
            return (
              <Tag color={percentage > 30 ? 'success' : 'processing'} style={{ borderRadius: 4 }}>
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
          title: 'Doanh thu ngày', 
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
    link.setAttribute("download", `Bao_cao_doanh_thu_${dayjs().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Báo cáo Doanh thu</Title>
          <Text type="secondary">Phân tích chi tiết doanh thu và hiệu suất kinh doanh của các sân đấu.</Text>
        </div>
        <Space wrap>
          <Select 
            value={selectedVenueId} 
            onChange={setSelectedVenueId} 
            style={{ width: 220 }}
            placeholder="Chọn sân đấu"
          >
            <Option value="ALL">Tất cả các cơ sở</Option>
            {venues.map(v => (
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

      <Spin spinning={isLoading} tip="Đang tải dữ liệu báo cáo...">
        {/* Top Stats */}
        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Space direction="vertical" size={4}>
                <Text type="secondary" strong>Tổng doanh thu</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: BRAND.primary }}>
                  {Number(revenueData?.totalRevenue || 0).toLocaleString()}đ
                </Title>
                <div style={{ color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <DollarCircleOutlined /> Doanh thu thực nhận sau thanh toán
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Space direction="vertical" size={4}>
                <Text type="secondary" strong>Tổng số lượt đặt sân (Bookings)</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
                  {revenueData?.totalBookings || 0}
                </Title>
                <div style={{ color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShopOutlined /> Tổng số yêu cầu đặt sân trong kì
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Space direction="vertical" size={4}>
                <Text type="secondary" strong>Lượt thanh toán thành công</Text>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#52c41a' }}>
                  {revenueData?.paidBookings || 0}
                </Title>
                <div style={{ color: '#52c41a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircleOutlined /> Tỉ lệ hoàn tất: {revenueData?.totalBookings ? Math.round((revenueData.paidBookings / revenueData.totalBookings) * 100) : 0}%
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          {/* Trend Line Chart */}
          <Col xs={24} lg={selectedVenueId === 'ALL' ? 16 : 24}>
            <Card 
              title={
                <Space>
                  <LineChartOutlined style={{ color: BRAND.primary }} />
                  <span>Biểu đồ doanh thu hàng ngày</span>
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

          {/* Breakdown Bar Chart (Only shown when viewing all venues) */}
          {selectedVenueId === 'ALL' && (
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <Space>
                    <DollarCircleOutlined style={{ color: BRAND.sky }} />
                    <span>Doanh thu theo sân</span>
                  </Space>
                }
                style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
              >
                {venueChartData.length === 0 ? (
                  <Empty description="Không có dữ liệu đóng góp từ các sân" style={{ padding: '60px 0' }} />
                ) : (
                  <div style={{ height: 350, width: '100%', marginTop: 20 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={venueChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} width={80} />
                        <RechartsTooltip 
                          cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                          formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                        />
                        <Bar dataKey="revenue" radius={[0, 10, 10, 0]} barSize={20}>
                          {venueChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>
          )}

          {/* Detailed Data Table */}
          <Col span={24}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span>Chi tiết số liệu thống kê</span>
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
      </Spin>
    </div>
  );
}
