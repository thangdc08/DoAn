import { useEffect, useMemo, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  Pagination,
  Empty,
  Tag,
  Space,
  Typography,
  Avatar,
  Input,
  DatePicker,
  TimePicker,
  Checkbox,
  Tooltip,
  Badge,
  message,
  Popover,
  Progress,
  Spin,
} from 'antd';
import {
  EnvironmentOutlined,
  UserOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  FacebookFilled,
  ThunderboltFilled,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { communityApi } from '../../services/communityApi';
import type { MatchPost, FacebookPost } from '../../types/community.types';
import { useCommunityStore } from '../../stores/communityStore';
import { useAuthStore } from '../../stores/authStore';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const CATEGORIES = [
  { icon: <UserOutlined style={{ fontSize: 18 }} />, label: 'Tìm kèo', id: 'matches' },
  { icon: <FacebookFilled style={{ fontSize: 18 }} />, label: 'Facebook', id: 'facebook' },
  { icon: <ThunderboltFilled style={{ fontSize: 18 }} />, label: 'Pass sân', id: 'pass' },
  { icon: <LinkOutlined style={{ fontSize: 18 }} />, label: 'Mua bán', id: 'shop' },
  { icon: <CustomerServiceOutlined style={{ fontSize: 18 }} />, label: 'Lớp dạy', id: 'class' },
  { icon: <TeamOutlined style={{ fontSize: 18 }} />, label: 'CLB', id: 'club' },
];

const LEVELS = ['Y', 'Y+', 'TBY', 'TBY+', 'TB-', 'TB', 'TB+', 'TB++', 'TBK'];

interface WeatherWidgetProps {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  isHeader?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude, locationName, isHeader }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  
  // Default coordinates to Hanoi if none provided
  const lat = latitude || 21.0285;
  const lng = longitude || 105.8542;
  const name = locationName || (isHeader ? "Khu vực của bạn (Hà Nội)" : "Sân đấu");

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await communityApi.getWeatherRecommendation(lat, lng);
      setData(res);
    } catch (err) {
      console.error("Error fetching weather", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lng]);

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  const getTheme = (score: number) => {
    if (score >= 80) {
      return {
        color: '#22c55e', // Green
        bg: '#f0fdf4',
        border: '#bbf7d0',
        text: '#15803d',
      };
    } else if (score >= 50) {
      return {
        color: '#eab308', // Yellow
        bg: '#fef9c3',
        border: '#fef08a',
        text: '#a16207',
      };
    } else {
      return {
        color: '#ef4444', // Red
        bg: '#fef2f2',
        border: '#fecaca',
        text: '#b91c1c',
      };
    }
  };

  const theme = getTheme(data?.score ?? 80);

  const popoverContent = (
    <div style={{ width: 280, padding: '4px' }} onClick={(e) => e.stopPropagation()}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <Spin size="small" />
        </div>
      ) : data ? (
        <div>
          {/* Active Area Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              <EnvironmentOutlined style={{ color: theme.color }} />
              <span>Khu vực đang xem:</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', background: '#f8fafc', padding: '6px 10px', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              {name}
            </div>
          </div>

          <div style={{ 
            background: theme.bg, 
            padding: '12px', 
            borderRadius: 12, 
            border: `1px solid ${theme.border}`,
            marginBottom: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: theme.text }}>
                {data.status} ({data.score}/100)
              </span>
            </div>
            <Progress 
              percent={data.score} 
              showInfo={false} 
              strokeColor={theme.color} 
              trailColor="#e2e8f0" 
              size="small" 
              style={{ margin: '4px 0 8px' }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', lineHeight: 1.4 }}>
              {data.advice}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Nhiệt độ / Độ ẩm</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>☀️ {data.temperature}°C · 💧 {data.humidity}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Chỉ số UV / Gió</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>☂️ {data.uvIndex} · 💨 {data.windSpeed} km/h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Chất lượng AQI</span>
              <span style={{ 
                fontWeight: 700, 
                color: data.aqi > 150 ? '#ef4444' : data.aqi > 100 ? '#eab308' : '#22c55e' 
              }}>
                😷 {data.aqi} ({data.aqi > 150 ? 'Xấu' : data.aqi > 100 ? 'Kém' : 'Tốt'})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Bụi mịn PM2.5</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>🌫️ {data.pm25} µg/m³</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
          Không thể tải dữ liệu thời tiết.
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      title={<div style={{ fontWeight: 800, fontSize: 14 }}>Gợi ý thời tiết chơi cầu</div>}
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
      placement="bottomLeft"
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: data ? theme.bg : '#f8fafc',
          border: `1px solid ${data ? theme.border : '#e2e8f0'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontWeight: 600,
          fontSize: 13,
          color: data ? theme.text : '#475569',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {loading ? (
          <Space size={4}>
            <Spin size="small" />
            <span style={{ fontSize: 12, color: '#64748b' }}>Đang tải thời tiết...</span>
          </Space>
        ) : (
          <>
            <span>☀️ {data ? `${data.temperature}°C` : '--°C'}</span>
            <span style={{ color: data ? theme.border : '#cbd5e1' }}>|</span>
            <span>💧 {data ? `${data.humidity}%` : '--%'}</span>
            {data && (
              <>
                <span style={{ color: theme.border }}>|</span>
                <span style={{ fontSize: 11, background: theme.color, color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                  {data.status}
                </span>
              </>
            )}
          </>
        )}
      </div>
    </Popover>
  );
};

interface UiMatch {
  id: string;
  title: string;
  description: string;
  location: string;
  genderInfo: string;
  levelCode: string;
  playDate: string;
  startTime: string;
  endTime: string;
  currentParticipants: number;
  maxParticipants: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

function FacebookPostCard({ post }: { post: FacebookPost }) {
  const [expanded, setExpanded] = useState(false);

  const displayLevel = post.level && post.level !== 'Không yêu cầu'
    ? post.level
    : null;
  const hasPriceBreakdown = post.priceBreakdown?.male || post.priceBreakdown?.female;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        marginBottom: 16,
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top info badge bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        flexWrap: 'wrap',
      }}>
        <Space size={4} style={{ marginRight: 2 }}>
          <ClockCircleOutlined style={{ color: '#6366f1', fontSize: 13 }} />
          <Text strong style={{ color: '#6366f1', fontSize: 13 }}>{post.time || '--:--'}</Text>
          {post.date && (
            <Text type="secondary" style={{ fontSize: 12 }}>({post.date})</Text>
          )}
        </Space>

        <Space size={4} style={{ marginRight: 2 }}>
          <EnvironmentOutlined style={{ color: BRAND.danger, fontSize: 13 }} />
          <Text strong style={{ color: BRAND.danger, fontSize: 13 }}>{post.location}</Text>
        </Space>

        {post.gender && (
          <Tag color={post.gender === 'Nữ' ? 'magenta' : post.gender === 'Nam/Nữ' ? 'cyan' : 'blue'}
               style={{ margin: 0, borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
            <TeamOutlined style={{ marginRight: 3 }} />{post.gender}
          </Tag>
        )}

        {hasPriceBreakdown ? (
          <Space size={4}>
            <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
              Nam: {post.priceBreakdown?.male || '--'}
            </Text>
            <Text style={{ fontSize: 12, color: '#ec4899', fontWeight: 600 }}>
              Nữ: {post.priceBreakdown?.female || '--'}
            </Text>
          </Space>
        ) : post.price ? (
          <Tag color="green" style={{ margin: 0, borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
            {post.price}
          </Tag>
        ) : null}

        {displayLevel && (
          <Tag color="orange" style={{ margin: 0, borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
            {displayLevel}
          </Tag>
        )}

        {post.playType && (
          <Tag style={{ margin: 0, borderRadius: 6, fontSize: 12, border: '1px solid #e2e8f0' }}>
            {post.playType === 'doi' ? 'Doi' : 'Don'}
          </Tag>
        )}

        <div style={{ flex: 1 }} />

        <Space size={4}>
          <Button shape="circle" size="small" icon={<ShareAltOutlined />}
            style={{ border: 'none', background: '#fff' }}
            onClick={(e) => { e.stopPropagation();
              navigator.clipboard.writeText(post.url);
              message.success('Da sao chep link!');
            }}
          />
          <Button shape="circle" size="small"
            icon={<FacebookFilled style={{ color: '#1877f2' }} />}
            style={{ border: 'none', background: '#eff6ff' }}
            onClick={(e) => { e.stopPropagation(); window.open(post.url, '_blank'); }}
          />
        </Space>
      </div>

      {/* Title */}
      <div style={{ padding: '12px 16px 0' }}>
        <Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>
          {post.title || 'Tuyen giao luu cau long tu Facebook'}
        </Title>
      </div>

      {/* Collapsible content */}
      <div style={{ padding: '6px 16px 0' }}>
        <Paragraph style={{
          fontSize: 13, lineHeight: 1.6, color: '#475569',
          whiteSpace: expanded ? 'pre-wrap' : 'normal', margin: 0,
        }}>
          {expanded
            ? post.content
            : (post.content && post.content.length > 160 ? post.content.substring(0, 160) + '...' : post.content)}
        </Paragraph>
        {post.content && post.content.length > 160 && (
          <Button type="link" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{ padding: 0, height: 'auto', fontSize: 12, fontWeight: 600, marginTop: 2 }}>
            {expanded ? 'Thu gon' : 'Xem chi tiet'}
          </Button>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px', borderTop: '1px solid #f1f5f9', marginTop: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={30} icon={<UserOutlined />} style={{ background: '#e2e8f0', color: '#475569' }} />
          <div>
            <Text strong style={{ fontSize: 13, display: 'block' }}>{post.userName || 'Thanh vien FB'}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(post.updatedAt).fromNow()}</Text>
          </div>
        </div>
        <Button type="primary" size="middle" style={{
          height: 32, borderRadius: 10, fontWeight: 700,
          background: '#1877f2', borderColor: '#1877f2', fontSize: 13,
        }}
          onClick={(e) => { e.stopPropagation(); window.open(post.url, '_blank'); }}
        >
          <FacebookFilled /> Xem tren FB
        </Button>
      </div>
    </Card>
  );
}


export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, isFavorite, joinMatch, selectedMatches } = useCommunityStore();

  const [activeCategory, setActiveCategory] = useState('matches');
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [fromTime, setFromTime] = useState<dayjs.Dayjs | null>(null);
  const [toTime, setToTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search');
    const lvl = searchParams.get('level');
    const cat = searchParams.get('category');
    const dt = searchParams.get('date');
    if (q !== null) setSearch(q);
    if (lvl !== null) setLevel(lvl);
    if (cat !== null) setActiveCategory(cat);
    if (dt) {
      const parsedDate = dayjs(dt);
      if (parsedDate.isValid()) {
        setDate(parsedDate);
      }
    }
  }, [searchParams]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [matchData, setMatchData] = useState<{ content: MatchPost[]; totalElements: number }>({
    content: [],
    totalElements: 0,
  });

  useEffect(() => {
    let ignore = false;

    if (activeCategory === 'facebook') {
      const loadFacebookPosts = async () => {
        setLoading(true);
        try {
          const response = await communityApi.getFacebookPosts();
          if (!ignore) {
            setFacebookPosts(response || []);
          }
        } catch (err) {
          console.error('Failed to load facebook posts:', err);
          if (!ignore) {
            setFacebookPosts([]);
          }
        } finally {
          if (!ignore) {
            setLoading(false);
          }
        }
      };
      loadFacebookPosts();
      return () => {
        ignore = true;
      };
    }

    const loadMatches = async () => {
      setLoading(true);
      try {
        const d = date ?? dayjs();
        const from = fromTime
          ? d.hour(fromTime.hour()).minute(fromTime.minute()).second(0).millisecond(0)
          : null;
        const to = toTime
          ? d.hour(toTime.hour()).minute(toTime.minute()).second(0).millisecond(0)
          : null;

        const response = await communityApi.getMatchPosts({
          q: search.trim() || undefined,
          level: level || undefined,
          status: 'OPEN',
          fromTime: from ? from.toISOString() : undefined,
          toTime: to ? to.toISOString() : undefined,
          page: Math.max(0, page - 1),
          size: pageSize,
        });

        if (!ignore) {
          setMatchData({
            content: response.content ?? [],
            totalElements: response.totalElements ?? 0,
          });
        }
      } catch {
        if (!ignore) {
          setMatchData({ content: [], totalElements: 0 });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMatches();

    return () => {
      ignore = true;
    };
  }, [activeCategory, search, level, date, fromTime, toTime, page]);

  const filteredFacebookPosts = useMemo(() => {
    if (activeCategory !== 'facebook') return [];
    return facebookPosts.filter((post) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const inUser = post.userName?.toLowerCase().includes(query);
        const inContent = post.content?.toLowerCase().includes(query);
        const inLocation = post.location?.toLowerCase().includes(query);
        if (!inUser && !inContent && !inLocation) return false;
      }
      if (level) {
        const postLevel = post.level?.toLowerCase() || '';
        const filterLevel = level.toLowerCase();
        if (!postLevel.includes(filterLevel)) return false;
      }
      return true;
    });
  }, [facebookPosts, activeCategory, search, level]);


  const uiMatchData = useMemo(() => {
    const content: UiMatch[] = matchData.content.map((post) => {
      const start = dayjs(post.startTime);
      const end = dayjs(post.endTime);
        return {
          id: post.id,
          title: post.title,
          description: post.description || '',
          location: post.venueName || post.venueAddress || 'Chưa cập nhật địa điểm',
        genderInfo:
          post.genderPreference === 'MALE'
            ? 'Nam'
            : post.genderPreference === 'FEMALE'
            ? 'Nữ'
            : 'Nam/Nữ',
          levelCode: post.level || '',
          playDate: start.isValid() ? start.format('DD/MM/YYYY') : '--/--/----',
          startTime: start.isValid() ? start.format('HH:mm') : '--:--',
          endTime: end.isValid() ? end.format('HH:mm') : '--:--',
          currentParticipants: Math.max((post.currentParticipants || 0) - 1, 0),
          maxParticipants: post.maxParticipants || 0,
          userName: post.hostName || 'Chủ kèo',
          userAvatar: undefined,
          createdAt: post.createdAt || post.startTime,
        };
    });

    return {
      content,
      totalElements: matchData.totalElements,
    };
  }, [matchData]);

  const filteredPosts = useMemo(() => {
    return uiMatchData.content.filter((post) => {
      if (!level) return true;
      return post.levelCode?.includes(level) || post.levelCode === level;
    });
  }, [uiMatchData.content, level]);

  const resetFilters = () => {
    setSearch('');
    setLevel('');
    setDate(dayjs());
    setFromTime(null);
    setToTime(null);
    setPage(1);
  };

  const renderSidebar = () => (
    <div className="sticky top-8">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: BRAND.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FilterOutlined style={{ color: BRAND.primary }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Bộ lọc nâng cao</span>
          </div>
        }
        bodyStyle={{ padding: '24px' }}
        style={{
          borderRadius: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)',
          background: '#fff',
        }}
      >
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text strong style={{ fontSize: 13, color: BRAND.text }}>
                Tìm kiếm nhanh
              </Text>
              <Tooltip title="Tìm theo tên chủ kèo, sân hoặc nội dung">
                <InfoCircleOutlined style={{ fontSize: 12, color: BRAND.textMuted }} />
              </Tooltip>
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: BRAND.textMuted }} />}
              placeholder="Nhập từ khóa..."
              size="large"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', background: '#f8fafc' }}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 13, color: BRAND.text }}>
              Chọn sân cầu lông
            </Text>
            <Select placeholder="Tất cả các sân" style={{ width: '100%' }} size="large" allowClear>
              <Option value="1">Sân Lê Văn Lương</Option>
              <Option value="2">BMC Nguyễn Xiển</Option>
              <Option value="3">Sân Cầu Giấy</Option>
            </Select>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 13, color: BRAND.text }}>
              Ngày thi đấu
            </Text>
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              value={date}
              onChange={(value) => {
                setDate(value);
                setPage(1);
              }}
              format="DD/MM/YYYY"
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 13, color: BRAND.text }}>
              Khung giờ rảnh
            </Text>
            <Row gutter={8}>
              <Col span={11}>
                <TimePicker
                  placeholder="Từ"
                  format="HH:mm"
                  value={fromTime}
                  onChange={(value) => {
                    setFromTime(value);
                    setPage(1);
                  }}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={2} style={{ textAlign: 'center', lineHeight: '42px', color: BRAND.textMuted }}>
                -
              </Col>
              <Col span={11}>
                <TimePicker
                  placeholder="Đến"
                  format="HH:mm"
                  value={toTime}
                  onChange={(value) => {
                    setToTime(value);
                    setPage(1);
                  }}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>

          <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: 12, border: '1px dashed #bbf7d0' }}>
            <Checkbox>
              <Text style={{ fontSize: 13, fontWeight: 600, color: BRAND.primaryDark }}>Ưu tiên sân đã có nữ</Text>
            </Checkbox>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 14, fontSize: 13, color: BRAND.text }}>
              Trình độ yêu cầu
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {LEVELS.map((l) => (
                <Button
                  key={l}
                  size="small"
                  type={level === l ? 'primary' : 'default'}
                  onClick={() => {
                    setLevel(level === l ? '' : l);
                    setPage(1);
                  }}
                  style={{
                    fontSize: 11,
                    height: 30,
                    minWidth: 42,
                    borderRadius: 8,
                    fontWeight: level === l ? 700 : 500,
                    boxShadow: level === l ? `0 4px 10px ${BRAND.primary}40` : 'none',
                  }}
                >
                  {l}
                </Button>
              ))}
            </div>
          </div>

          <Button block size="large" style={{ marginTop: 8, borderRadius: 12, fontWeight: 700 }} onClick={resetFilters}>
            Làm mới bộ lọc
          </Button>
        </Space>
      </Card>
    </div>
  );

  const renderMatchCard = (match: UiMatch) => {
    const originalMatch = matchData.content.find((m) => m.id === match.id) || ({
      id: match.id,
      title: match.title,
      description: match.description,
      startTime: match.startTime,
      endTime: match.endTime,
      venueName: match.location,
      maxParticipants: match.maxParticipants,
      currentParticipants: match.currentParticipants,
      hostName: match.userName,
      level: match.levelCode,
      status: 'OPEN',
      createdAt: match.createdAt,
      updatedAt: match.createdAt,
    } as MatchPost);

    const favorited = isFavorite(match.id);
    const joined = selectedMatches.some(sm => sm.match.id === match.id && sm.selectedStatus !== 'deselected');

    const handleHeartClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        message.warning('Vui lòng đăng nhập để lưu bài viết quan tâm!');
        navigate('/login');
        return;
      }
      toggleFavorite(originalMatch);
      if (!favorited) {
        message.success('Đã lưu bài viết quan tâm ❤️');
      } else {
        message.success('Đã bỏ quan tâm bài viết.');
      }
    };

    const handleJoinClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        message.warning('Vui lòng đăng nhập để đăng ký tham gia kèo!');
        navigate('/login');
        return;
      }
      joinMatch(originalMatch);
      message.success('Đăng ký tham gia kèo thành công! Hãy theo dõi tại mục "Kèo đã chọn".');
    };

    return (
      <Card
        key={match.id}
        hoverable
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: 24,
          marginBottom: 20,
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)',
        }}
        onClick={() => navigate(`/community/matches/${match.id}`)}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: 140,
              background: '#f8fafc',
              borderRight: '1px solid #f1f5f9',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ color: BRAND.sky, marginBottom: 8 }}>
              <ClockCircleOutlined style={{ fontSize: 24 }} />
            </div>
            <Text strong style={{ fontSize: 16, display: 'block' }}>
              {match.startTime}
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {match.endTime}
            </Text>
            <div style={{ marginTop: 16 }}>
              <Badge count={match.levelCode} style={{ background: BRAND.warning, color: '#fff', fontWeight: 800, border: 'none' }} />
            </div>
          </div>

          <div style={{ flex: 1, padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <Space direction="vertical" size={0}>
                <Space style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <Space>
                    <EnvironmentOutlined style={{ color: BRAND.danger }} />
                    <Text strong style={{ color: BRAND.danger, fontSize: 14 }}>
                      {match.location}
                    </Text>
                  </Space>
                  <WeatherWidget 
                    latitude={originalMatch.latitude} 
                    longitude={originalMatch.longitude} 
                    locationName={match.location} 
                  />
                </Space>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tag color="blue" style={{ border: 'none', borderRadius: 6 }}>
                    {match.genderInfo}
                  </Tag>
                  <Tag color="cyan" style={{ border: 'none', borderRadius: 6 }}>
                    <CalendarOutlined /> {match.playDate}
                  </Tag>
                </div>
              </Space>
              <Space>
                <Button shape="circle" icon={<FacebookFilled />} style={{ color: '#1877f2', border: 'none', background: '#eff6ff' }} />
                <Button 
                  shape="circle" 
                  icon={<ShareAltOutlined />} 
                  style={{ border: 'none', background: '#f8fafc' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/community/matches/${match.id}`);
                    message.success('Đã sao chép link kèo đấu!');
                  }}
                />
                <Button 
                  shape="circle" 
                  icon={favorited ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />} 
                  style={{ border: 'none', background: favorited ? '#fef2f2' : '#f8fafc' }} 
                  onClick={handleHeartClick}
                />
              </Space>
            </div>
            <Title level={4} style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>
              {match.title}
            </Title>
            <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
              {match.description}
            </Paragraph>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, color: '#475569', fontSize: 13, fontWeight: 600 }}>
              <span><CalendarOutlined /> {match.playDate}</span>
              <span><ClockCircleOutlined /> {match.startTime} - {match.endTime}</span>
              <span><TeamOutlined /> {match.currentParticipants}/{match.maxParticipants} người</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={40} src={match.userAvatar} icon={<UserOutlined />} style={{ border: `2px solid ${BRAND.primaryLight}` }} />
                <div>
                  <Text strong style={{ display: 'block', fontSize: 15 }}>
                    {match.userName}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(match.createdAt).fromNow()}
                  </Text>
                </div>
              </div>
              {joined ? (
                <Button disabled style={{ height: 44, padding: '0 32px', borderRadius: 12, fontWeight: 800 }}>
                  Đã đăng ký
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ height: 44, padding: '0 32px', borderRadius: 12, fontWeight: 800 }}
                  onClick={handleJoinClick}
                >
                  Tham gia ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0 100px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={40} align="top">
          <Col xs={0} lg={8}>
            {renderSidebar()}
          </Col>
          <Col xs={24} lg={16}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    className="category-tab-btn"
                    type={activeCategory === cat.id ? 'primary' : 'default'}
                    size="large"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setPage(1);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontWeight: 700,
                      height: 52,
                      padding: '0 28px',
                      borderRadius: 16,
                      border: activeCategory === cat.id ? 'none' : '1px solid #e2e8f0',
                      boxShadow: activeCategory === cat.id ? `0 8px 20px ${BRAND.primary}30` : 'none',
                      background: activeCategory === cat.id ? BRAND.primary : '#fff',
                      color: activeCategory === cat.id ? '#fff' : '#1e293b',
                    }}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            <Card
              style={{
                borderRadius: 24,
                background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
                color: '#fff',
                marginBottom: 24,
                border: 'none',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.15)',
              }}
              bodyStyle={{ padding: '32px 40px' }}
            >
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '65%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Cộng đồng SmashMate
                    </div>
                  </div>
                  <Title level={2} style={{ color: '#fff', margin: 0, fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
                    Tìm kèo cầu lông ưng ý ngay
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>
                    Kết nối hàng ngàn tay vợt, tìm đối thủ xứng tầm gần bạn nhất.
                  </Paragraph>
                </div>

                <div style={{ position: 'relative', height: 100, width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 80, opacity: 0.2 }}>🏸</div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-10%',
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  pointerEvents: 'none',
                }}
              />
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 8px', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <Title level={3} style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
                    {activeCategory === 'facebook' ? 'Tin tuyển giao lưu từ Facebook' : 'Kèo mới đăng tải'}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {activeCategory === 'facebook'
                      ? `Hiển thị ${Math.min(filteredFacebookPosts.slice((page - 1) * pageSize, page * pageSize).length, pageSize)} trên tổng số ${filteredFacebookPosts.length} kết quả`
                      : `Hiển thị ${uiMatchData.content.length} trên tổng số ${uiMatchData.totalElements} kết quả`}
                  </Text>
                </div>
                <WeatherWidget isHeader={true} />
              </div>
              <Space>
                {activeCategory === 'facebook' && (
                  <Tooltip title="Quét bài viết mới từ Facebook">
                    <Button 
                      icon={<ReloadOutlined />} 
                      shape="round" 
                      size="large" 
                      style={{ fontWeight: 600, background: '#1877f2', color: '#fff', border: 'none' }} 
                      loading={loading} 
                      onClick={async () => { 
                        message.loading({ content: 'Đang quét Facebook...', key: 'scrape', duration: 0 }); 
                        try { 
                          await communityApi.scrapeFacebookPosts(); 
                          message.success({ content: 'Quét xong! Đang tải lại...', key: 'scrape', duration: 2 }); 
                          const posts = await communityApi.getFacebookPosts(); 
                          setFacebookPosts(posts || []); 
                        } catch { 
                          message.error({ content: 'Quét thất bại. Kiểm tra cookies FB.', key: 'scrape', duration: 3 }); 
                        } 
                      }}
                    >
                      Quét bài viết
                    </Button>
                  </Tooltip>
                )}
                <Button icon={<FilterOutlined />} shape="round" size="large" style={{ fontWeight: 600 }}>
                  Sắp xếp: Mới nhất
                </Button>
              </Space>
            </div>
            {loading ? (
              <Card loading style={{ borderRadius: 16 }} />
            ) : activeCategory === 'facebook' ? (
              filteredFacebookPosts.length > 0 ? (
                filteredFacebookPosts
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((post) => <FacebookPostCard key={post._id} post={post} />)
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<Text type="secondary">Không tìm thấy bài viết Facebook phù hợp. Hãy thử thay đổi bộ lọc!</Text>}
                  style={{ padding: '60px 0' }}
                />
              )
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(renderMatchCard)
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<Text type="secondary">Không tìm thấy kèo phù hợp. Hãy thử thay đổi bộ lọc!</Text>}
                style={{ padding: '60px 0' }}
              />
            )}
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <Pagination
                current={page}
                total={activeCategory === 'facebook' ? filteredFacebookPosts.length : uiMatchData.totalElements}
                pageSize={pageSize}
                onChange={setPage}
                showSizeChanger={false}
                style={{ fontWeight: 600 }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
