import { Row, Col, Card, Statistic, Typography, Space, Button, Table, Progress } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  TrophyOutlined, 
  ArrowUpOutlined, 
  LineChartOutlined,
  GlobalOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { BRAND } from '../../theme/antdTheme';

const { Title, Text } = Typography;

const USER_STATS = [
  { name: 'Người chơi', value: 850, color: BRAND.primary },
  { name: 'Chủ sân', value: 120, color: BRAND.sky },
  { name: 'Admin', value: 5, color: '#722ed1' },
];

const GROWTH_DATA = [
  { name: 'Jan', users: 400, venues: 20 },
  { name: 'Feb', users: 600, venues: 35 },
  { name: 'Mar', users: 800, venues: 48 },
  { name: 'Apr', users: 1100, venues: 65 },
  { name: 'May', users: 1400, venues: 82 },
  { name: 'Jun', users: 1800, venues: 95 },
];

export default function AdminReportPage() {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Báo cáo Hệ thống</Title>
          <Text type="secondary">Phân tích tăng trưởng và hiệu suất toàn bộ nền tảng.</Text>
        </div>
        <Button icon={<DownloadOutlined />} type="primary" style={{ background: BRAND.primary }}>Xuất báo cáo PDF</Button>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng người dùng" value={975} prefix={<UserOutlined />} valueStyle={{ fontWeight: 800 }} />
            <div style={{ color: '#52c41a', fontSize: 13, marginTop: 8 }}><ArrowUpOutlined /> 24% month over month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng sân đấu" value={142} prefix={<HomeOutlined />} valueStyle={{ fontWeight: 800 }} />
            <div style={{ color: '#52c41a', fontSize: 13, marginTop: 8 }}><ArrowUpOutlined /> 12% month over month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Kèo giao lưu" value={3240} prefix={<TrophyOutlined />} valueStyle={{ fontWeight: 800 }} />
            <div style={{ color: '#52c41a', fontSize: 13, marginTop: 8 }}><ArrowUpOutlined /> 45% month over month</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <Statistic title="Doanh thu hệ thống" value={1520} suffix="M" prefix={<GlobalOutlined />} valueStyle={{ fontWeight: 800 }} />
            <div style={{ color: '#52c41a', fontSize: 13, marginTop: 8 }}><ArrowUpOutlined /> 18% month over month</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Biểu đồ tăng trưởng người dùng & sân" 
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <div style={{ height: 400, width: '100%', marginTop: 20 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={GROWTH_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="users" name="Người dùng" fill={BRAND.primary} radius={[6, 6, 0, 0]} barSize={32} />
                    <Bar dataKey="venues" name="Sân mới" fill={BRAND.sky} radius={[6, 6, 0, 0]} barSize={32} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Cơ cấu vai trò người dùng" 
            style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <div style={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={USER_STATS}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {USER_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 20 }}>
              {USER_STATS.map(stat => (
                <div key={stat.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Space><div style={{ width: 10, height: 10, borderRadius: '50%', background: stat.color }} /> <Text>{stat.name}</Text></Space>
                  <Text strong>{stat.value} ({Math.round(stat.value / 9.75)}%)</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={24}>
           <Card title="Top khu vực có nhiều sân nhất" style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Row gutter={[40, 20]}>
                 <Col xs={24} md={12}>
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                       <div><Text>Quận 10</Text><Progress percent={85} strokeColor={BRAND.primary} /></div>
                       <div><Text>Quận Phú Nhuận</Text><Progress percent={72} strokeColor={BRAND.primary} /></div>
                       <div><Text>Quận Tân Bình</Text><Progress percent={68} strokeColor={BRAND.primary} /></div>
                    </Space>
                 </Col>
                 <Col xs={24} md={12}>
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                       <div><Text>Quận 7</Text><Progress percent={54} strokeColor={BRAND.sky} /></div>
                       <div><Text>Quận Bình Thạnh</Text><Progress percent={48} strokeColor={BRAND.sky} /></div>
                       <div><Text>Quận 1</Text><Progress percent={42} strokeColor={BRAND.sky} /></div>
                    </Space>
                 </Col>
              </Row>
           </Card>
        </Col>
      </Row>
    </div>
  );
}
