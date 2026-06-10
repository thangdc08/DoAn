import { useNavigate } from 'react-router-dom';
import { Card, Empty, Typography, Button, Row, Col, Tag, Avatar, Space, Tooltip, message } from 'antd';
import {
  HeartFilled,
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useCommunityStore } from '../../stores/communityStore';
import { useAuthStore } from '../../stores/authStore';
import { communityApi } from '../../services/communityApi';
import { getLevelLabel, getLevelColor } from '../../constants/levels';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect } from 'react';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

export default function FavoriteMatchesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, selectedMatches, syncSelectedMatches } = useCommunityStore();
  const { user } = useAuthStore();

  const [joinedStatuses, setJoinedStatuses] = useState<Record<string, 'PENDING' | 'APPROVED' | 'HOST' | 'NONE'>>({});
  const [joiningMap, setJoiningMap] = useState<Record<string, boolean>>({});
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (!user || favorites.length === 0) {
      setJoinedStatuses({});
      return;
    }

    let isSubscribed = true;
    const fetchStatuses = async () => {
      const statusesMap: Record<string, 'PENDING' | 'APPROVED' | 'HOST' | 'NONE'> = {};
      
      await Promise.all(
        favorites.map(async (m) => {
          if (m.hostId === user.id) {
            statusesMap[m.id] = 'HOST';
            return;
          }
          try {
            const participants = await communityApi.getMatchParticipants(m.id);
            const myPart = participants.find(p => p.userId === user.id);
            if (myPart) {
              if (myPart.status === 'PENDING') {
                statusesMap[m.id] = 'PENDING';
              } else if (myPart.status === 'APPROVED') {
                statusesMap[m.id] = 'APPROVED';
              } else {
                statusesMap[m.id] = 'NONE';
              }
            } else {
              statusesMap[m.id] = 'NONE';
            }
          } catch (err) {
            console.error(`Error loading participants for match ${m.id}`, err);
            statusesMap[m.id] = 'NONE';
          }
        })
      );

      if (isSubscribed) {
        setJoinedStatuses(statusesMap);
      }
    };

    fetchStatuses();
    return () => {
      isSubscribed = false;
    };
  }, [favorites, user, refreshCounter]);

  const handleToggleFavorite = (match: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(match);
    message.success('Đã bỏ quan tâm bài viết.');
  };

  const handleJoinMatch = async (match: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      message.warning('Vui lòng đăng nhập để đăng ký tham gia kèo!');
      navigate('/login');
      return;
    }

    setJoiningMap(prev => ({ ...prev, [match.id]: true }));
    try {
      await communityApi.joinMatch(match.id);

      if (match.joinMode === 'APPROVAL') {
        message.info('Yêu cầu tham gia kèo thành công! Vui lòng chờ chủ kèo duyệt.');
      } else {
        message.success('Đăng ký tham gia kèo thành công!');
      }

      await syncSelectedMatches();
      setRefreshCounter(prev => prev + 1);
    } catch (err: any) {
      console.error('Failed to join match:', err);
      message.error(err?.message || 'Có lỗi xảy ra khi tham gia kèo. Vui lòng thử lại.');
    } finally {
      setJoiningMap(prev => ({ ...prev, [match.id]: false }));
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-80px)] py-8 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/community')}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-green font-bold mb-3 border-none bg-transparent cursor-pointer transition-colors"
            >
              <ArrowLeftOutlined /> Quay lại cộng đồng
            </button>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
              Bài viết quan tâm ❤️
            </Title>
            <Paragraph type="secondary" className="text-slate-500 text-sm font-medium m-0 mt-1">
              Lưu trữ các kèo đấu bạn đang theo dõi hoặc muốn tham gia.
            </Paragraph>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto mt-8 px-6 text-center">
            {/* Custom SVG Illustration for Empty State */}
            <div className="w-48 h-48 mb-6 text-red-400">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="5" cy="5" r="1.5" fill="#fca5a5" className="animate-ping" />
                <circle cx="19" cy="7" r="1" fill="#ef4444" />
                <path
                  d="M12 20.25l-1.15-1.04C6.75 15.5 4 13.04 4 10c0-2.46 1.94-4.4 4.4-4.4 1.39 0 2.73.65 3.6 1.67.87-1.02 2.21-1.67 3.6-1.67 2.46 0 4.4 1.94 4.4 4.4 0 3.04-2.75 5.5-6.85 9.21L12 20.25z"
                  fill="#fee2e2"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Title level={4} style={{ fontWeight: 800, margin: '0 0 8px' }}>
              Chưa có bài viết quan tâm nào
            </Title>
            <Paragraph type="secondary" className="max-w-md mb-8 text-[14px]">
              Bấm vào biểu tượng trái tim ❤️ ở mỗi thẻ kèo đấu trên trang cộng đồng để lưu lại tại đây và nhận thông báo khi có thay đổi.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/community')}
              className="rounded-xl px-8 font-extrabold h-12 shadow-lg shadow-emerald-500/20"
            >
              Khám phá kèo đấu ngay
            </Button>
          </div>
        ) : (
        <Row gutter={[24, 24]}>
          {favorites.map((match) => {
            const start = dayjs(match.startTime);
            const end = dayjs(match.endTime);
            const joined = isJoined(match.id);

            return (
              <Col xs={24} md={12} xl={8} key={match.id}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 24 }}
                  className="rounded-3xl border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  onClick={() => navigate(`/community/matches/${match.id}`)}
                >
                  {/* Heart Button Overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <Tooltip title="Bỏ quan tâm">
                      <Button
                        shape="circle"
                        type="text"
                        icon={<HeartFilled style={{ color: '#ef4444', fontSize: 18 }} />}
                        className="bg-red-50 hover:bg-red-100 border-none w-10 h-10 flex items-center justify-center shadow-sm"
                        onClick={(e) => handleToggleFavorite(match, e)}
                      />
                    </Tooltip>
                  </div>

                  <Space direction="vertical" size={16} className="w-full">
                    {/* Host Header */}
                    <div className="flex items-center gap-3 pr-10">
                      <Avatar
                        size={40}
                        src={match.hostAvatar}
                        icon={<UserOutlined />}
                        className="border-2 border-emerald-50 bg-emerald-100 text-emerald-700"
                      />
                      <div>
                        <span className="block font-bold text-slate-800 text-[14px]">
                          {match.hostName || 'Chủ kèo'}
                        </span>
                        <span className="block text-slate-400 text-xs font-semibold">
                          {dayjs(match.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>

                    {/* Match Title */}
                    <div>
                      <Title level={5} className="font-extrabold text-slate-900 m-0 line-clamp-1">
                        {match.title}
                      </Title>
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="text-xs mt-1 mb-0 leading-relaxed">
                        {match.description}
                      </Paragraph>
                    </div>

                    {/* Tags / Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      <Tag color="emerald" className="border-none rounded-md font-bold px-2 py-0.5 text-xs">
                        {getLevelLabel(match.level)}
                      </Tag>
                      <Tag color="blue" className="border-none rounded-md font-bold px-2 py-0.5 text-xs">
                        {match.genderPreference === 'MALE' ? 'Nam' : match.genderPreference === 'FEMALE' ? 'Nữ' : 'Nam/Nữ'}
                      </Tag>
                    </div>

                    <hr className="border-slate-50 my-1" />

                    {/* Time & Venue Info */}
                    <div className="space-y-2 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-slate-400" />
                        <span>Thi đấu: {start.isValid() ? start.format('DD/MM/YYYY') : 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-slate-400" />
                        <span>Giờ chơi: {start.isValid() ? start.format('HH:mm') : 'Chưa cập nhật'} - {end.isValid() ? end.format('HH:mm') : 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <EnvironmentOutlined className="text-red-400" />
                        <span className="truncate">{match.venueName || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TeamOutlined className="text-blue-400" />
                        <span>Sĩ số: {match.currentParticipants}/{match.maxParticipants} người</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex gap-2">
                      <Button
                        type="default"
                        icon={<ShareAltOutlined />}
                        className="rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`${window.location.origin}/community/matches/${match.id}`);
                          message.success('Đã sao chép link kèo đấu!');
                        }}
                      />
                      {(() => {
                        const joinedStatus = joinedStatuses[match.id] || 'NONE';
                        const isOwner = match.hostId === user?.id;
                        const isFull = match.currentParticipants >= match.maxParticipants;
                        const isJoining = joiningMap[match.id] || false;

                        if (isOwner) {
                          return (
                            <Button
                              disabled
                              className="flex-1 rounded-xl h-10 font-bold bg-slate-50 border-slate-200 text-slate-400"
                            >
                              Kèo của bạn
                            </Button>
                          );
                        }
                        if (joinedStatus === 'PENDING') {
                          return (
                            <Button
                              disabled
                              className="flex-1 rounded-xl h-10 font-bold bg-amber-50 border-amber-200 text-amber-600"
                            >
                              Chờ duyệt
                            </Button>
                          );
                        }
                        if (joinedStatus === 'APPROVED') {
                          return (
                            <Button
                              disabled
                              className="flex-1 rounded-xl h-10 font-bold bg-emerald-50 border-emerald-200 text-emerald-600"
                            >
                              Đã tham gia
                            </Button>
                          );
                        }
                        if (isFull) {
                          return (
                            <Button
                              disabled
                              className="flex-1 rounded-xl h-10 font-bold bg-slate-50 border-slate-200 text-slate-400"
                            >
                              Hết chỗ
                            </Button>
                          );
                        }
                        return (
                          <Button
                            type="primary"
                            loading={isJoining}
                            className="flex-1 rounded-xl h-10 font-bold"
                            onClick={(e) => handleJoinMatch(match, e)}
                          >
                            Tham gia ngay
                          </Button>
                        );
                      })()}
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      </div>
    </div>
  );
}
