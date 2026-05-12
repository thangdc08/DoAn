import { useMemo } from 'react';
import { Card, Row, Col, Typography, Space, Button, Table, Tag, Select } from 'antd';
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
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  DownloadOutlined, 
  FilterOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  DollarCircleOutlined,
  LineChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;
const { Option } = Select;

const REVENUE_TREND = [
  { month: 'Jan', revenue: 45000000, bookings: 320 },
  { month: 'Feb', revenue: 52000000, bookings: 350 },
  { month: 'Mar', revenue: 48000000, bookings: 310 },
  { month: 'Apr', revenue: 61000000, bookings: 420 },
  { month: 'May', revenue: 55000000, bookings: 380 },
  { month: 'Jun', revenue: 67000000, bookings: 450 },
];

const REVENUE_BY_COURT = [
  { name: 'Sân 1', revenue: 25000000, color: '#00A651' },
  { name: 'Sân 2', revenue: 18000000, color: '#005BAC' },
  { name: 'Sân 3', revenue: 22000000, color: '#722ed1' },
  { name: 'Sân 4', revenue: 12000000, color: '#fa8c16' },
  { name: 'Sân 5', revenue: 30000000, color: '#eb2f96' },
];

export default function OwnerRevenuePage() {
  const totalRevenue = useMemo(() => REVENUE_TREND.reduce((sum, item) => sum + item.revenue, 0), []);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Báo cáo Doanh thu</Title>
          <Text type="secondary">Phân tích chi tiết doanh thu và hiệu suất kinh doanh của bạn.</Text>
        </div>
        <Space>
          <Select defaultValue="this-month" style={{ width: 160 }}>
            <Option value="this-month">Tháng này</Option>
            <Option value="last-month">Tháng trước</Option>
            <Option value="this-year">Năm nay</Option>
          </Select>
          <Button icon={<DownloadOutlined />} type="primary" style={{ background: BRAND.primary }}>Xuất báo cáo</Button>
        </Space>
      </div>

      {/* Top Stats */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Tổng doanh thu (6 tháng)</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{totalRevenue.toLocaleString()}đ</Title>
              <div style={{ color: '#52c41a', fontSize: 13 }}>
                <ArrowUpOutlined /> 15.2% so với 6 tháng trước
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Doanh thu trung bình/tháng</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{(totalRevenue / 6).toLocaleString()}đ</Title>
              <div style={{ color: '#52c41a', fontSize: 13 }}>
                <ArrowUpOutlined /> 4.3% so với tháng trước
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bodyStyle={{ padding: 24 }} style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" strong>Tỷ lệ lấp đầy sân</Text>
              <Title level={2} style={{ margin: 0, fontWeight: 800 }}>78.5%</Title>
              <div style={{ color: '#ff4d4f', fontSize: 13 }}>
                <ArrowDownOutlined /> 2.1% so với tuần trước
              </div>
            </Space>
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
                <span>Xu hướng doanh thu theo tháng</span>
              </Space>
            }
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <div style={{ height: 350, width: '100%', marginTop: 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val/1000000}M`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={BRAND.primary} 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: BRAND.primary, strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Breakdown Bar Chart */}
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
            <div style={{ height: 350, width: '100%', marginTop: 20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_BY_COURT} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()}đ`, 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" radius={[0, 10, 10, 0]} barSize={24}>
                    {REVENUE_BY_COURT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Detailed Data Table */}
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>Bảng kê doanh thu chi tiết</span>
                <Button icon={<FilterOutlined />} size="small">Lọc</Button>
              </div>
            }
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table
              dataSource={REVENUE_TREND}
              rowKey="month"
              pagination={false}
              columns={[
                { title: 'Tháng', dataIndex: 'month', key: 'month', render: (text) => <Text strong>{text}</Text> },
                { title: 'Số lượng Booking', dataIndex: 'bookings', key: 'bookings', align: 'center' },
                { 
                  title: 'Doanh thu tháng', 
                  dataIndex: 'revenue', 
                  key: 'revenue', 
                  render: (val) => <Text strong style={{ color: BRAND.primary }}>{val.toLocaleString()}đ</Text> 
                },
                { 
                  title: 'Tăng trưởng', 
                  key: 'growth', 
                  render: (_, __, index) => (
                    <Tag color={index % 2 === 0 ? 'success' : 'processing'} style={{ borderRadius: 4 }}>
                      +{Math.floor(Math.random() * 10) + 5}%
                    </Tag>
                  ) 
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
