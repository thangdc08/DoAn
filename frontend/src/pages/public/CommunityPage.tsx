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
  ClockCircleOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  FacebookFilled,
  ThunderboltFilled,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { communityApi } from '../../services/communityApi';
import type { MatchPost } from '../../types/community.types';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const CATEGORIES = [
  { icon: <UserOutlined />, label: 'Tìm kèo', id: 'matches' },
  { icon: <ThunderboltFilled />, label: 'Pass sân', id: 'pass' },
  { icon: <LinkOutlined />, label: 'Mua bán', id: 'shop' },
  { icon: <CustomerServiceOutlined />, label: 'Lớp dạy', id: 'class' },
  { icon: <TeamOutlined />, label: 'CLB', id: 'club' },
];

const LEVELS = ['Y', 'Y+', 'TBY', 'TBY+', 'TB-', 'TB', 'TB+', 'TB++', 'TBK'];

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

export default function CommunityPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('matches');
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [fromTime, setFromTime] = useState<dayjs.Dayjs | null>(null);
  const [toTime, setToTime] = useState<dayjs.Dayjs | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<{ content: MatchPost[]; totalElements: number }>({
    content: [],
    totalElements: 0,
  });

  useEffect(() => {
    let ignore = false;

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
  }, [search, level, date, fromTime, toTime, page]);

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

  const renderMatchCard = (match: UiMatch) => (
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
              <Space style={{ marginBottom: 4 }}>
                <EnvironmentOutlined style={{ color: BRAND.danger }} />
                <Text strong style={{ color: BRAND.danger, fontSize: 14 }}>
                  {match.location}
                </Text>
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
              <Button shape="circle" icon={<ShareAltOutlined />} style={{ border: 'none', background: '#f8fafc' }} />
              <Button shape="circle" icon={<HeartOutlined />} style={{ border: 'none', background: '#f8fafc' }} />
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
            <Button type="primary" size="large" style={{ height: 44, padding: '0 32px', borderRadius: 12, fontWeight: 800 }}>
              Tham gia ngay
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

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
                    type={activeCategory === cat.id ? 'primary' : 'default'}
                    icon={cat.icon}
                    size="large"
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 700,
                      height: 52,
                      padding: '0 28px',
                      borderRadius: 16,
                      border: activeCategory === cat.id ? 'none' : '1px solid #e2e8f0',
                      boxShadow: activeCategory === cat.id ? `0 8px 20px ${BRAND.primary}30` : 'none',
                      background: activeCategory === cat.id ? BRAND.primary : '#fff',
                    }}
                  >
                    {cat.label}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '0 8px' }}>
              <div>
                <Title level={3} style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
                  Kèo mới đăng tải
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Hiển thị {uiMatchData.content.length} trên tổng số {uiMatchData.totalElements} kết quả
                </Text>
              </div>
              <Button icon={<FilterOutlined />} shape="round" size="large" style={{ fontWeight: 600 }}>
                Sắp xếp: Mới nhất
              </Button>
            </div>
            {loading ? (
              <Card loading style={{ borderRadius: 16 }} />
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
                total={uiMatchData.totalElements}
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
