import { useMemo } from 'react';
import { Row, Col, Card, Typography, Avatar, Tag, Button, Spin, Empty, Rate } from 'antd';
import {
  TrophyOutlined,
  CalendarOutlined,
  FireOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';
import { communityApi } from '../../services/communityApi';
import { bookingApi } from '../../services/bookingApi';
import { getLevelLabel, getLevelColor } from '../../constants/levels';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const { Title, Text } = Typography;

// ─── Unified Agenda Item ─────────────────────────────────────────────────────
interface AgendaItem {
  id: string;
  type: 'MATCH' | 'BOOKING';
  title: string;
  time: string;
  sortTime: string;
  location: string;
  status: string;
}

export default function UserDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // ── Fetch player statistics ────────────────────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['player-stats', user?.id],
    queryFn: () => communityApi.getPlayerStats(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // ── Fetch upcoming bookings ────────────────────────────────────────────────
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['my-bookings-dashboard', user?.id],
    queryFn: () => bookingApi.getMyBookings({ page: 0, size: 5, status: 'PAID' }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // ── Fetch upcoming joined matches ──────────────────────────────────────────
  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['joined-matches-dashboard', user?.id],
    queryFn: () => communityApi.getJoinedMatches({ page: 0, size: 5, status: 'OPEN' }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // ── Merge and sort agenda items ────────────────────────────────────────────
  const agendaItems = useMemo<AgendaItem[]>(() => {
    const items: AgendaItem[] = [];

    (bookingsData?.content ?? []).forEach((b) => {
      const firstItem = b.items?.[0];
      if (!firstItem) return;
      items.push({
        id: b.id,
        type: 'BOOKING',
        title: b.venueNameSnapshot,
        time: dayjs(firstItem.startTime).format('ddd, DD/MM - HH:mm'),
        sortTime: firstItem.startTime,
        location: b.venueNameSnapshot,
        status: b.status,
      });
    });

    (matchesData?.content ?? []).forEach((m) => {
      items.push({
        id: m.id,
        type: 'MATCH',
        title: m.title,
        time: dayjs(m.startTime).format('ddd, DD/MM - HH:mm'),
        sortTime: m.startTime,
        location: m.venueName || m.venueAddress || 'Chưa có địa điểm',
        status: m.status,
      });
    });

    return items.sort((a, b) => (a.sortTime < b.sortTime ? -1 : 1)).slice(0, 6);
  }, [bookingsData, matchesData]);

  const isAgendaLoading = bookingsLoading || matchesLoading;

  // ── Stat cards configuration ───────────────────────────────────────────────
  const levelLabel = getLevelLabel(user?.level);
  const levelColor = getLevelColor(user?.level);

  const statCards = [
    {
      title: 'Tổng trận đấu',
      value: statsLoading ? '—' : String(stats?.totalMatches ?? 0),
      suffix: 'trận',
      icon: <FireOutlined />,
      gradient: 'from-orange-500 to-red-500',
      sub: 'Số trận đã hoàn thành',
      extra: null,
    },
    {
      title: 'Điểm uy tín',
      value: statsLoading ? '—' : String(stats?.reliabilityPoints ?? 950),
      suffix: 'pts',
      icon: <ThunderboltOutlined />,
      gradient: 'from-green-400 to-emerald-600',
      sub: stats?.averageRating
        ? `Đánh giá TB: ${stats.averageRating.toFixed(1)}★`
        : user?.rating
          ? `Đánh giá: ${user.rating.toFixed(1)}★ (${user.reviewCount ?? 0} đánh giá)`
          : 'Chưa có đánh giá',
      extra: (
        <Rate
          disabled
          allowHalf
          value={stats?.averageRating ?? user?.rating ?? 0}
          style={{ fontSize: 12, color: '#f59e0b' }}
        />
      ),
    },
    {
      title: 'Cấp độ',
      value: levelLabel,
      suffix: '',
      icon: <RiseOutlined />,
      gradient: 'from-blue-500 to-indigo-600',
      sub: user?.level ? `Mã: ${user.level}` : 'Chưa cập nhật trình độ',
      extra: user?.level ? (
        <Tag color={levelColor} className="m-0 font-bold text-xs rounded-md">
          {user.level}
        </Tag>
      ) : null,
    },
  ];

  const performanceData = stats?.performanceData ?? [
    { name: 'Thứ 2', matches: 0 },
    { name: 'Thứ 3', matches: 0 },
    { name: 'Thứ 4', matches: 0 },
    { name: 'Thứ 5', matches: 0 },
    { name: 'Thứ 6', matches: 0 },
    { name: 'Thứ 7', matches: 0 },
    { name: 'Chủ nhật', matches: 0 },
  ];

  const totalWeekMatches = performanceData.reduce((s, d) => s + (d.matches as number), 0);

  // ── Render agenda status badge ─────────────────────────────────────────────
  const renderStatusBadge = (item: AgendaItem) => {
    if (item.type === 'BOOKING') {
      return <Tag color="blue" className="m-0 rounded-full text-[10px]">Đã đặt sân</Tag>;
    }
    if (item.status === 'OPEN') {
      return <Tag color="success" className="m-0 rounded-full text-[10px]">Đã xác nhận</Tag>;
    }
    if (item.status === 'CLOSED') {
      return <Tag color="warning" className="m-0 rounded-full text-[10px]">Đã đóng</Tag>;
    }
    return <Tag color="default" className="m-0 rounded-full text-[10px]">{item.status}</Tag>;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 md:p-4">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">Bảng điều khiển</Title>
          <Text type="secondary" className="text-lg">
            Chào mừng trở lại,{' '}
            <Text strong style={{ color: BRAND.primary }}>{user?.fullName}</Text>
            ! Bạn đã sẵn sàng cho những trận cầu hôm nay chưa?
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<CalendarOutlined />}
          className="h-12 px-8 rounded-xl font-bold shadow-lg"
          style={{ boxShadow: `0 8px 24px ${BRAND.primary}33` }}
          onClick={() => navigate('/venues')}
        >
          Đặt sân ngay
        </Button>
      </div>

      {/* ── Stats Cards (3 columns) ── */}
      <Row gutter={[20, 20]} className="mb-8">
        {statCards.map((stat, idx) => (
          <Col xs={24} sm={8} key={idx}>
        <Card
              bordered={false}
              className="relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-0 h-full"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {stat.icon}
                  </div>
                  {stat.extra ? stat.extra : <TrophyOutlined className="text-gray-200" />}
                </div>
                <Text type="secondary" className="text-xs font-semibold uppercase tracking-wider">
                  {stat.title}
                </Text>
                {statsLoading ? (
                  <div className="mt-2"><Spin size="small" /></div>
                ) : (
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black" style={{ color: '#1a1a2e' }}>{stat.value}</span>
                    {stat.suffix && (
                      <span className="text-lg font-bold text-gray-400">{stat.suffix}</span>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND.primary }}>
                  <RiseOutlined />
                  <span>{stat.sub}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* ── Performance Chart ── */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 rounded-full" style={{ background: BRAND.primary }} />
                <span className="text-base font-bold">Hoạt động trong tuần này</span>
              </div>
            }
            extra={
              <Tag color="green">
                {totalWeekMatches} trận
              </Tag>
            }
            className="rounded-2xl border-none h-full"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorMatchesLive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }}
                    itemStyle={{ color: BRAND.primary, fontWeight: 'bold' }}
                    formatter={(val: number) => [`${val} trận`, 'Số trận']}
                  />
                  <Area
                    type="monotone"
                    dataKey="matches"
                    stroke={BRAND.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMatchesLive)"
                    animationDuration={1500}
                    dot={{ fill: BRAND.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Summary strip below chart */}
            <div className="mt-4 p-4 rounded-xl flex items-center justify-between" style={{ background: '#f8fffe' }}>
              <div className="flex items-center gap-3">
                <Avatar.Group maxCount={3}>
                  <Avatar style={{ backgroundColor: BRAND.primary }}>
                    {user?.fullName?.charAt(0) ?? 'U'}
                  </Avatar>
                  <Avatar style={{ backgroundColor: '#6366f1' }}><TeamOutlined /></Avatar>
                  <Avatar style={{ backgroundColor: '#f59e0b' }}><TrophyOutlined /></Avatar>
                </Avatar.Group>
                <Text type="secondary" className="text-sm">
                  Tổng cộng{' '}
                  <Text strong>{stats?.totalMatches ?? 0} trận</Text>{' '}
                  đã hoàn thành.
                </Text>
              </div>
              <Button
                type="link"
                className="font-bold p-0 text-sm"
                style={{ color: BRAND.primary }}
                onClick={() => navigate('/user/matches')}
              >
                Xem chi tiết <ArrowRightOutlined />
              </Button>
            </div>
          </Card>
        </Col>

        {/* ── Right Column ── */}
        <Col xs={24} lg={8}>
          {/* Agenda Card */}
          <Card
            title={<span className="text-base font-bold">Lịch thi đấu & Booking</span>}
            extra={
              <Button
                type="link"
                size="small"
                className="p-0 font-semibold text-xs"
                style={{ color: BRAND.primary }}
                onClick={() => navigate('/user/matches')}
              >
                Xem tất cả <ArrowRightOutlined />
              </Button>
            }
            className="rounded-2xl border-none mb-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: '0 16px 16px' }}
          >
            {isAgendaLoading ? (
              <div className="flex justify-center py-10">
                <Spin tip="Đang tải lịch..." />
              </div>
            ) : agendaItems.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary" className="text-xs">
                    Chưa có lịch nào sắp tới.<br />
                    Hãy tham gia một kèo hoặc đặt sân ngay!
                  </Text>
                }
                className="py-8"
              >
                <Button
                  size="small"
                  type="primary"
                  onClick={() => navigate('/community')}
                  className="rounded-lg font-bold"
                >
                  Tìm kèo ngay
                </Button>
              </Empty>
            ) : (
              <div className="divide-y divide-gray-50">
                {agendaItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 group cursor-pointer"
                    onClick={() =>
                      navigate(
                        item.type === 'MATCH'
                          ? `/community/matches/${item.id}`
                          : `/user/bookings`
                      )
                    }
                  >
                    <div className="flex gap-3">
                      {/* Type icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                          item.type === 'MATCH'
                            ? 'bg-orange-50 text-orange-500'
                            : 'bg-blue-50 text-blue-500'
                        }`}
                      >
                        {item.type === 'MATCH' ? <SwordsIcon size={18} /> : <CalendarOutlined />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <Text strong className="text-sm leading-tight block truncate">
                            {item.title}
                          </Text>
                          {renderStatusBadge(item)}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <Text type="secondary" className="text-xs flex items-center gap-1">
                            <ClockCircleOutlined style={{ fontSize: 10 }} />
                            {item.time}
                          </Text>
                          <Text type="secondary" className="text-xs flex items-center gap-1 truncate">
                            <EnvironmentOutlined style={{ fontSize: 10 }} />
                            <span className="truncate">{item.location}</span>
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* CTA Dark Card */}
          <Card
            bordered={false}
            className="rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', boxShadow: '0 4px 20px rgba(26,26,46,0.3)' }}
            bodyStyle={{ padding: 20 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <TrophyOutlined style={{ color: '#fbbf24', fontSize: 18 }} />
              </div>
              <Title level={5} style={{ color: 'white', margin: 0 }}>Tìm kèo giao lưu!</Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }} className="block mb-4">
              Hàng chục kèo đấu mới mỗi ngày. Tìm đối thủ phù hợp với trình độ{' '}
              <Text style={{ color: BRAND.primary, fontWeight: 700 }}>{levelLabel}</Text>
              {user?.level && (
                <Tag color={levelColor} className="ml-1 font-bold text-xs">{user.level}</Tag>
              )}
            </Text>
            <Button
              block
              ghost
              className="rounded-xl h-10 font-bold"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              onClick={() => navigate('/community')}
            >
              Khám phá ngay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// ── Inline Swords SVG icon ───────────────────────────────────────────────────
function SwordsIcon({ size }: { size: number }) {
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
