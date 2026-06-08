import { useEffect, useMemo, useState } from 'react';
import {
  Card, Row, Col, Typography, List, Avatar, Tag, Button, Space, message, Spin, Table, Progress, Divider
} from 'antd';
import {
  UserOutlined, ShopOutlined, DollarOutlined, ClockCircleOutlined,
  FileSearchOutlined, MessageOutlined, AreaChartOutlined, BarChartOutlined,
  TrophyOutlined, CheckCircleOutlined, CloseCircleOutlined, WalletOutlined,
  TeamOutlined, WarningOutlined, RiseOutlined, CalendarOutlined,
} from '@ant-design/icons';
import { BRAND } from '../../theme/antdTheme';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, ReferenceLine,
} from 'recharts';
import { adminApi } from '../../services/adminApi';
import { venueApi } from '../../services/venueApi';
import { bookingApi } from '../../services/bookingApi';
import { communityApi } from '../../services/communityApi';
import { payoutApi } from '../../services/payoutApi';
import type { Venue } from '../../types/venue.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// ─── helpers ────────────────────────────────────────────────────────────────

const fmtVND = (v: number) => `${v.toLocaleString('vi-VN')} đ`;

function StatCard({
  title, value, subtext, icon, color, trend,
}: {
  title: string; value: string | number; subtext?: string;
  icon: React.ReactNode; color: string; trend?: string;
}) {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
      bodyStyle={{ padding: '20px 22px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, flexShrink: 0,
          background: `${color}18`, color, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.4px' }}>
            {title}
          </Text>
          <Title level={3} style={{ margin: '4px 0 2px', fontWeight: 800, lineHeight: 1.2 }}>
            {value}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {subtext && <Text type="secondary" style={{ fontSize: 11 }}>{subtext}</Text>}
            {trend && (
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiseOutlined /> {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Revenue Chart (Premium) ─────────────────────────────────────────────────

const STROKE_COLOR = '#00c6a2';
const STROKE_COLOR2 = '#0ea5e9';

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val: number = payload[0]?.value ?? 0;
  const bookings: number = payload[1]?.value ?? 0;
  return (
    <div style={{
      background: '#0f172a', borderRadius: 12, padding: '12px 16px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.25)', border: '1px solid #1e293b', minWidth: 180,
    }}>
      <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: STROKE_COLOR, display: 'inline-block' }} />
            Doanh thu
          </span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
            {val >= 1_000_000
              ? `${(val / 1_000_000).toFixed(2)}M đ`
              : `${val.toLocaleString('vi-VN')} đ`}
          </span>
        </div>
        {bookings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1', fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: STROKE_COLOR2, display: 'inline-block' }} />
              Lượt đặt
            </span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{bookings} lượt</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: Array<{ name: string; revenue: number; bookings: number }> }) {
  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const avgRev = data.length ? Math.round(totalRev / data.length) : 0;
  const peakRev = data.reduce((m, d) => Math.max(m, d.revenue), 0);
  const peakDay = data.find(d => d.revenue === peakRev)?.name ?? '—';

  const fmtShort = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : String(v);

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0', height: '100%',
    }}>
      {/* ── Dark gradient header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        padding: '20px 24px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
              Doanh thu hệ thống
            </div>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
              {totalRev >= 1_000_000
                ? `${(totalRev / 1_000_000).toFixed(2)}M đ`
                : `${totalRev.toLocaleString('vi-VN')} đ`}
            </div>
            <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>7 ngày gần nhất</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trung bình/ngày</div>
              <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 15 }}>{fmtShort(avgRev)} đ</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cao nhất ({peakDay})</div>
              <div style={{ color: STROKE_COLOR, fontWeight: 700, fontSize: 15 }}>{fmtShort(peakRev)} đ</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart body ── */}
      <div style={{ background: '#fff', padding: '0 8px 16px' }}>
        <div style={{ height: 230, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={STROKE_COLOR} stopOpacity={0.35} />
                  <stop offset="60%" stopColor={STROKE_COLOR} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={STROKE_COLOR} stopOpacity={0} />
                </linearGradient>
                <filter id="revGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={fmtShort}
                width={42}
              />
              <RechartsTooltip content={<RevenueTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
              {avgRev > 0 && (
                <ReferenceLine
                  y={avgRev}
                  stroke="#94a3b8"
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                  label={{ value: 'TB', position: 'insideTopRight', fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                />
              )}
              <Area
                type="monotoneX"
                dataKey="revenue"
                stroke={STROKE_COLOR}
                strokeWidth={3}
                fill="url(#revGradPremium)"
                dot={false}
                activeDot={{ r: 6, fill: '#fff', stroke: STROKE_COLOR, strokeWidth: 2.5, filter: 'url(#revGlow)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Day-by-day mini breakdown ── */}
        {data.length > 1 && (
          <div style={{ display: 'flex', gap: 6, padding: '0 12px', overflowX: 'auto' }}>
            {data.map(d => {
              const pct = peakRev > 0 ? (d.revenue / peakRev) * 100 : 0;
              return (
                <div key={d.name} style={{ flex: 1, textAlign: 'center', minWidth: 36 }}>
                  <div style={{
                    height: 4, borderRadius: 4, background: '#f1f5f9', marginBottom: 4, position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${pct}%`, borderRadius: 4,
                      background: `linear-gradient(90deg, ${STROKE_COLOR}, ${STROKE_COLOR2})`,
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{d.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Users
  const [userCount, setUserCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Venues
  const [pendingVenues, setPendingVenues] = useState<Venue[]>([]);
  const [totalVenues, setTotalVenues] = useState(0);

  // Reports
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  // Booking & Revenue
  const [revenue, setRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [paidBookings, setPaidBookings] = useState(0);
  const [failedBookings, setFailedBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [venueBreakdown, setVenueBreakdown] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<Array<{ name: string; revenue: number; bookings: number }>>([]);

  // Payouts
  const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);
  const [pendingPayoutsCount, setPendingPayoutsCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const today = dayjs();
        const startStr = today.subtract(6, 'day').format('YYYY-MM-DD');
        const endStr = today.format('YYYY-MM-DD');

        const [usersRes, venuesPendingRes, allVenuesRes, revenueRes, reportsRes, payoutsRes] =
          await Promise.allSettled([
            adminApi.getUsers({ page: 0, size: 1 }),
            venueApi.getPendingVenues(),
            venueApi.getVenues(),
            bookingApi.getAdminRevenue({ startDate: startStr, endDate: endStr }),
            communityApi.getReports({ status: 'PENDING', page: 0, size: 5 }),
            payoutApi.getAllRequestsForAdmin(),
          ]);

        // Users
        if (usersRes.status === 'fulfilled') {
          setUserCount(usersRes.value.totalElements || 0);
          setActiveUsers(usersRes.value.totalElements || 0);
        }

        // Venues
        if (venuesPendingRes.status === 'fulfilled') {
          const arr = Array.isArray(venuesPendingRes.value) ? venuesPendingRes.value : [];
          setPendingVenues(arr);
        }
        if (allVenuesRes.status === 'fulfilled') {
          setTotalVenues((allVenuesRes.value || []).length);
        }

        // Reports
        if (reportsRes.status === 'fulfilled') {
          setPendingReports(reportsRes.value.content || []);
          setPendingReportsCount(reportsRes.value.totalElements || 0);
        }

        // Revenue & Booking
        if (revenueRes.status === 'fulfilled') {
          const val = revenueRes.value;
          setRevenue(val.totalRevenue || 0);
          setTotalBookings(val.totalBookings || 0);
          setPaidBookings(val.paidBookings || 0);
          setFailedBookings(val.failedBookings || 0);
          setPendingBookings(val.pendingBookings || 0);
          setVenueBreakdown(val.venueBreakdown || []);
          setRevenueChart(
            (val.dailyBreakdown || []).map(item => ({
              name: dayjs(item.date).format('DD/MM'),
              revenue: item.revenue || 0,
              bookings: item.bookingCount || 0,
            }))
          );
        }

        // Payouts
        if (payoutsRes.status === 'fulfilled') {
          const all = payoutsRes.value || [];
          const pending = all.filter((p: any) => p.status === 'PENDING');
          setPendingPayouts(pending.slice(0, 3));
          setPendingPayoutsCount(pending.length);
        }
      } catch (error) {
        console.error(error);
        message.error('Không tải được dashboard admin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Booking pie data
  const bookingPieData = useMemo(() => [
    { name: 'Thành công', value: paidBookings, color: '#10b981' },
    { name: 'Chờ xử lý', value: pendingBookings, color: '#f59e0b' },
    { name: 'Thất bại', value: failedBookings, color: '#ef4444' },
  ], [paidBookings, pendingBookings, failedBookings]);

  const successRate = totalBookings > 0 ? Math.round((paidBookings / totalBookings) * 100) : 0;

  // Ranking table columns
  const rankingColumns = [
    {
      title: 'Hạng', key: 'rank', width: 60, align: 'center' as const,
      render: (_: any, __: any, i: number) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[i]
          ? <span style={{ fontSize: 16 }}>{medals[i]}</span>
          : <span style={{ fontWeight: 600, color: '#94a3b8' }}>{i + 1}</span>;
      },
    },
    {
      title: 'Cơ sở', dataIndex: 'venueName', key: 'venueName',
      render: (t: string) => <Text strong>{t || 'Không xác định'}</Text>,
    },
    {
      title: 'Booking', dataIndex: 'bookingCount', key: 'bookingCount', align: 'center' as const,
      render: (v: number) => <Tag color="blue">{v} lượt</Tag>,
    },
    {
      title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right' as const,
      render: (v: number) => <Text strong style={{ color: BRAND.primary }}>{fmtVND(v)}</Text>,
    },
  ];

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              TỔNG QUAN HỆ THỐNG
            </Title>
            <Text type="secondary">
              Theo dõi toàn bộ hoạt động nền tảng BadmintonHub — {dayjs().format('dddd, DD/MM/YYYY')}
            </Text>
          </div>
          <Space>
            <Tag color="green" style={{ borderRadius: 6, padding: '4px 10px', fontSize: 12 }}>
              ● Hệ thống hoạt động bình thường
            </Tag>
          </Space>
        </div>

        {/* ── Row 1: 4 top KPI cards ── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tổng thành viên" value={userCount.toLocaleString('vi-VN')}
              subtext="Người dùng đã đăng ký"
              icon={<TeamOutlined />} color="#6366f1"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Doanh thu hệ thống" value={fmtVND(revenue)}
              subtext="7 ngày gần nhất"
              icon={<DollarOutlined />} color="#0ea5e9"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tổng lượt đặt sân" value={totalBookings.toLocaleString('vi-VN')}
              subtext={`Tỉ lệ thành công: ${successRate}%`}
              icon={<CalendarOutlined />} color={BRAND.primary}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Cơ sở đang hoạt động" value={totalVenues}
              subtext={`${pendingVenues.length} cơ sở chờ duyệt`}
              icon={<ShopOutlined />} color="#f59e0b"
            />
          </Col>
        </Row>

        {/* ── Row 2: 4 secondary KPI cards ── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Booking thành công" value={paidBookings}
              subtext="Đã thanh toán"
              icon={<CheckCircleOutlined />} color="#10b981"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Booking chờ xử lý" value={pendingBookings}
              subtext="Chưa thanh toán"
              icon={<ClockCircleOutlined />} color="#f59e0b"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Yêu cầu rút tiền" value={pendingPayoutsCount}
              subtext="Đang chờ phê duyệt"
              icon={<WalletOutlined />} color="#8b5cf6"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Báo cáo vi phạm" value={pendingReportsCount}
              subtext="Cần giải quyết"
              icon={<WarningOutlined />} color="#ef4444"
            />
          </Col>
        </Row>

        {/* ── Row 3: Charts ── */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          {/* Revenue Area Chart — Premium */}
          <Col xs={24} lg={14}>
            <RevenueChart data={revenueChart} />
          </Col>

          {/* Booking Pie + Bar */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 700 }}>PHÂN LOẠI BOOKING</span>
                </Space>
              }
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
              bodyStyle={{ paddingTop: 8 }}
            >
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bookingPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {bookingPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} />
                    <RechartsTooltip formatter={(v: any, name: any) => [`${v} lượt`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: 4 }}>
                {bookingPieData.map(d => (
                  <div key={d.name} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: d.color }}>{d.value}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{d.name}</Text>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tỉ lệ thành công</Text>
                  <Text strong style={{ fontSize: 12, color: '#10b981' }}>{successRate}%</Text>
                </div>
                <Progress percent={successRate} strokeColor="#10b981" trailColor="#fee2e2" showInfo={false} size="small" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* ── Row 4: Booking Count Bar Chart ── */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#0ea5e9' }} />
                  <span style={{ fontWeight: 700 }}>LƯỢT ĐẶT SÂN 7 NGÀY GẦN NHẤT</span>
                </Space>
              }
              style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              bodyStyle={{ paddingTop: 8 }}
            >
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                      formatter={(v: any) => [`${v} lượt đặt`, 'Booking']}
                    />
                    <Bar dataKey="bookings" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Pending Payouts */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <WalletOutlined style={{ color: '#8b5cf6' }} />
                  <span style={{ fontWeight: 700 }}>YÊU CẦU RÚT TIỀN CHỜ DUYỆT</span>
                </Space>
              }
              extra={
                <Button type="link" style={{ fontSize: 12 }} onClick={() => navigate('/admin/payouts')}>
                  Xem tất cả
                </Button>
              }
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
            >
              {pendingPayouts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                  <WalletOutlined style={{ fontSize: 28, marginBottom: 8 }} />
                  <div>Không có yêu cầu nào đang chờ</div>
                </div>
              ) : (
                <List
                  dataSource={pendingPayouts}
                  locale={{ emptyText: 'Không có yêu cầu chờ duyệt' }}
                  renderItem={(item: any) => (
                    <List.Item
                      extra={
                        <Button size="small" type="primary" ghost onClick={() => navigate('/admin/payouts')}>
                          Xử lý
                        </Button>
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<WalletOutlined />} style={{ background: '#ede9fe', color: '#8b5cf6', borderRadius: 8 }} />}
                        title={<Text strong style={{ fontSize: 13 }}>{fmtVND(item.amount)}</Text>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.bankName} — {item.bankAccount}</Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* ── Row 5: Venue Ranking + Approvals + Reports ── */}
        <Row gutter={[20, 20]}>
          {/* Top Venue Ranking */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined style={{ color: '#f59e0b' }} />
                  <span style={{ fontWeight: 700 }}>XẾP HẠNG DOANH THU CƠ SỞ</span>
                </Space>
              }
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', height: '100%' }}
            >
              <Table
                dataSource={venueBreakdown.slice(0, 5)}
                columns={rankingColumns}
                rowKey="venueId"
                pagination={false}
                size="small"
                locale={{ emptyText: 'Chưa có dữ liệu doanh thu.' }}
              />
            </Card>
          </Col>

          {/* Right column: Pending venues + Violation reports */}
          <Col xs={24} lg={12}>
            {/* Pending Venue Approvals */}
            <Card
              title={
                <Space>
                  <FileSearchOutlined style={{ color: BRAND.primary }} />
                  <span style={{ fontWeight: 700 }}>PHÊ DUYỆT CƠ SỞ MỚI</span>
                  {pendingVenues.length > 0 && (
                    <Tag color="orange" style={{ borderRadius: 6, fontSize: 11 }}>{pendingVenues.length} chờ duyệt</Tag>
                  )}
                </Space>
              }
              extra={<Button type="link" style={{ fontSize: 12 }} onClick={() => navigate('/admin/venues')}>Xem tất cả</Button>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}
            >
              <List
                itemLayout="horizontal"
                dataSource={pendingVenues.slice(0, 3)}
                locale={{ emptyText: 'Không có cơ sở nào đang chờ duyệt ✓' }}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      <Space>
                        <Button size="small" type="primary" ghost onClick={() => navigate('/admin/venues')}>
                          Xem hồ sơ
                        </Button>
                        <Tag color="warning" style={{ borderRadius: 4 }}>Chờ duyệt</Tag>
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<ShopOutlined />} style={{ background: '#f0fdf4', color: BRAND.primary, borderRadius: 8 }} />}
                      title={<Text strong style={{ fontSize: 13 }}>{item.name}</Text>}
                      description={<Text type="secondary" style={{ fontSize: 11 }}>{item.address}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Violation Reports */}
            <Card
              title={
                <Space>
                  <MessageOutlined style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 700 }}>BÁO CÁO VI PHẠM KHẨN</span>
                  {pendingReportsCount > 0 && (
                    <Tag color="red" style={{ borderRadius: 6, fontSize: 11 }}>{pendingReportsCount}</Tag>
                  )}
                </Space>
              }
              extra={<Button type="link" style={{ fontSize: 12 }} onClick={() => navigate('/admin/reports')}>Xem tất cả</Button>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
            >
              {pendingReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 6 }} />
                  <div style={{ fontSize: 13 }}>Không có báo cáo khẩn nào</div>
                </div>
              ) : (
                pendingReports.slice(0, 2).map((item: any) => (
                  <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Tag color="red" style={{ fontSize: 10, borderRadius: 4 }}>Khẩn cấp</Tag>
                      <Text type="secondary" style={{ fontSize: 10 }}>ID: {item.id}</Text>
                    </div>
                    <Text strong style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
                      {item.reason || 'Báo cáo vi phạm'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
                      {item.description || 'Không có mô tả chi tiết.'}
                    </Text>
                    <Button size="small" danger block onClick={() => navigate('/admin/reports')}>
                      Giải quyết ngay
                    </Button>
                  </div>
                ))
              )}
            </Card>
          </Col>
        </Row>

      </div>
    </Spin>
  );
}
