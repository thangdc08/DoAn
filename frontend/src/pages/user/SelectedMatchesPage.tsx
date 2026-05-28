import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tabs, Badge, Button, Empty, Typography, Tag, Avatar, Space, Modal, Rate, Input, message, Spin, Divider } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  ArrowRightOutlined,
  HistoryOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useCommunityStore } from '../../stores/communityStore';
import type { SelectedMatchStatus, SelectedMatch } from '../../stores/communityStore';
import { BRAND } from '../../theme/antdTheme';
import dayjs from 'dayjs';
import { useAuthStore } from '../../stores/authStore';
import { communityApi } from '../../services/communityApi';
import { venueApi } from '../../services/venueApi';
import type { MatchPost, MatchParticipant } from '../../types/community.types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function SelectedMatchesPage() {
  const navigate = useNavigate();
  const { selectedMatches, cancelJoin, updateMatchStatus, removeSelectedMatch } = useCommunityStore();

  const { user } = useAuthStore();

  // Rating Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);
  const [participants, setParticipants] = useState<MatchParticipant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  
  // Venue rating state
  const [venueStars, setVenueStars] = useState(5);
  const [venueComment, setVenueComment] = useState('');
  
  // Players rating state: Map of userId -> { stars: number, comment: string }
  const [playerRatings, setPlayerRatings] = useState<Record<string, { stars: number; comment: string }>>({});
  const [submittingRating, setSubmittingRating] = useState(false);

  // Group matches by tab/status
  const matchesToday = selectedMatches.filter((sm) => {
    if (sm.selectedStatus === 'deselected' || sm.selectedStatus === 'joined') return false;
    const isTodayDate = dayjs(sm.match.startTime).isSame(dayjs(), 'day');
    return sm.selectedStatus === 'today' || (sm.selectedStatus === 'upcoming' && isTodayDate);
  });

  const matchesUpcoming = selectedMatches.filter((sm) => {
    if (sm.selectedStatus === 'deselected' || sm.selectedStatus === 'joined') return false;
    const isTodayDate = dayjs(sm.match.startTime).isSame(dayjs(), 'day');
    return sm.selectedStatus === 'upcoming' && !isTodayDate;
  });

  const matchesPending = selectedMatches.filter((sm) => sm.selectedStatus === 'pending');
  const matchesJoined = selectedMatches.filter((sm) => sm.selectedStatus === 'joined');
  const matchesDeselected = selectedMatches.filter((sm) => sm.selectedStatus === 'deselected');

  const handleOpenRating = async (match: MatchPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setVenueStars(5);
    setVenueComment('');
    setPlayerRatings({});
    setRatingModalOpen(true);
    
    if (match.id) {
      setLoadingParticipants(true);
      try {
        const list = await communityApi.getMatchParticipants(match.id);
        // Filter out current user & approved participants
        const otherParticipants = list.filter((p) => p.userId !== user?.id && p.status === 'APPROVED');
        setParticipants(otherParticipants);
        
        // Initialize ratings state
        const initialRatings: Record<string, { stars: number; comment: string }> = {};
        otherParticipants.forEach((p) => {
          initialRatings[p.userId] = { stars: 5, comment: '' };
        });
        setPlayerRatings(initialRatings);
      } catch (err) {
        console.error('Lỗi tải danh sách thành viên:', err);
        message.error('Không thể tải danh sách thành viên tham gia.');
      } finally {
        setLoadingParticipants(false);
      }
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedMatch) return;
    
    setSubmittingRating(true);
    try {
      const promises: Promise<any>[] = [];
      
      // 1. Rate Venue if present & stars > 0
      if (selectedMatch.venueId) {
        promises.push(
          venueApi.rateVenue(selectedMatch.venueId, {
            stars: venueStars,
            comment: venueComment,
          }).catch((err) => {
            console.error('Lỗi đánh giá sân:', err);
            throw new Error(`Không thể gửi đánh giá cho sân: ${err.message || ''}`);
          })
        );
      }
      
      // 2. Rate Players
      Object.entries(playerRatings).forEach(([ratedUserId, rating]) => {
        promises.push(
          communityApi.ratePlayer(selectedMatch.id, {
            rateeUserId: ratedUserId,
            stars: rating.stars,
            comment: rating.comment,
          }).catch((err) => {
            console.error(`Lỗi đánh giá người chơi ${ratedUserId}:`, err);
            throw new Error(`Không thể gửi đánh giá cho bạn chơi: ${err.message || ''}`);
          })
        );
      });
      
      await Promise.all(promises);
      message.success('Đã gửi đánh giá thành công! Cảm ơn nhận xét của bạn.');
      setRatingModalOpen(false);
    } catch (err: any) {
      message.error(err.message || 'Đã xảy ra lỗi khi gửi đánh giá.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleStatusChange = (matchId: string, status: SelectedMatchStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    updateMatchStatus(matchId, status);
    message.success('Cập nhật trạng thái kèo đấu thành công.');
  };

  const handleCancelJoin = (matchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cancelJoin(matchId);
    message.success('Đã hủy tham gia kèo đấu.');
  };

  const handleRemoveMatch = (matchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSelectedMatch(matchId);
    message.success('Đã xóa kèo đấu khỏi lịch sử.');
  };

  const renderEmptyState = (tabLabel: string) => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto px-6 text-center mt-6">
      <div className="w-40 h-40 mb-6 text-emerald-400">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="2" cy="6" r="1" fill="#34d399" className="animate-ping" />
          <circle cx="22" cy="18" r="1.5" fill="#059669" />
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#e6f4ea" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" fill="#10b981" />
        </svg>
      </div>
      <Title level={4} style={{ fontWeight: 800, margin: '0 0 8px' }}>
        Danh sách trống
      </Title>
      <Paragraph type="secondary" className="max-w-xs mb-8 text-[14px]">
        Bạn không có kèo nào trong danh mục "{tabLabel}" ở thời điểm hiện tại.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        onClick={() => navigate('/community')}
        className="rounded-xl px-8 font-extrabold h-12 shadow-lg shadow-emerald-500/20"
      >
        Tìm kèo giao lưu ngay
      </Button>
    </div>
  );

  const renderMatchList = (items: SelectedMatch[], tabLabel: string) => {
    if (items.length === 0) return renderEmptyState(tabLabel);

    return (
      <div className="space-y-4">
        {items.map(({ match, selectedStatus, joinedAt }) => {
          const start = dayjs(match.startTime);
          const end = dayjs(match.endTime);

          return (
            <Card
              key={match.id}
              hoverable
              bodyStyle={{ padding: 20 }}
              className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              onClick={() => navigate(`/community/matches/${match.id}`)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Time Section */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center flex-shrink-0">
                    <span className="text-[14px] font-extrabold text-slate-800 leading-none">
                      {start.isValid() ? start.format('HH:mm') : match.startTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">
                      {start.isValid() ? start.format('DD/MM') : '--/--'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Title level={5} className="font-extrabold text-slate-900 m-0 leading-tight">
                        {match.title}
                      </Title>
                      {selectedStatus === 'today' && <Tag color="red" className="border-none font-bold text-[10px] rounded-md px-1.5 py-0.5 animate-pulse">HÔM NAY</Tag>}
                      {selectedStatus === 'pending' && <Tag color="warning" className="border-none font-bold text-[10px] rounded-md px-1.5 py-0.5">CHỜ DUYỆT</Tag>}
                      {selectedStatus === 'joined' && <Tag color="success" className="border-none font-bold text-[10px] rounded-md px-1.5 py-0.5">ĐÃ THAM GIA</Tag>}
                      {selectedStatus === 'deselected' && <Tag color="default" className="border-none font-bold text-[10px] rounded-md px-1.5 py-0.5">ĐÃ HỦY/TỪ CHỐI</Tag>}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <EnvironmentOutlined className="text-red-400" />
                      <span className="truncate max-w-[200px] md:max-w-md">{match.venueName || match.venueAddress || (match as any).location || 'Chưa cập nhật'}</span>
                      <span className="text-slate-300">|</span>
                      <UserOutlined className="text-slate-400" />
                      <span>{match.hostName || (match as any).userName || 'Chủ kèo'}</span>
                    </div>
                  </div>
                </div>

                {/* Match Information Summary */}
                <div className="flex items-center gap-6 text-slate-500 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined />
                    <span>{start.isValid() ? `${start.format('HH:mm')} - ${end.format('HH:mm')}` : `${match.startTime} - ${match.endTime}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TeamOutlined />
                    <span>{match.currentParticipants}/{match.maxParticipants} người</span>
                  </div>
                </div>

                {/* Tab specific actions */}
                <div className="flex items-center gap-2 justify-end">
                  {selectedStatus === 'pending' && (
                    <Button
                      type="default"
                      danger
                      onClick={(e) => handleCancelJoin(match.id, e)}
                      className="rounded-xl font-bold h-10 px-4"
                    >
                      Hủy yêu cầu
                    </Button>
                  )}

                  {(selectedStatus === 'upcoming' || selectedStatus === 'today') && (
                    <div className="flex gap-2">
                      <Button
                        type="default"
                        onClick={(e) => handleCancelJoin(match.id, e)}
                        className="rounded-xl font-bold h-10 px-4"
                      >
                        Hủy lịch
                      </Button>
                      <Button
                        type="primary"
                        onClick={(e) => handleStatusChange(match.id, 'joined', e)}
                        className="rounded-xl font-bold h-10 px-4"
                      >
                        Đã chơi xong
                      </Button>
                    </div>
                  )}

                  {selectedStatus === 'joined' && (
                    <div className="flex gap-2">
                      <Button
                        type="default"
                        icon={<StarOutlined />}
                        onClick={(e) => handleOpenRating(match, e)}
                        className="rounded-xl font-bold h-10 px-4 border-amber-200 text-amber-600 hover:bg-amber-50"
                      >
                        Đánh giá buổi chơi
                      </Button>
                      <Button
                        type="default"
                        onClick={(e) => handleRemoveMatch(match.id, e)}
                        className="rounded-xl font-bold h-10 px-4"
                      >
                        Xóa lịch sử
                      </Button>
                    </div>
                  )}

                  {selectedStatus === 'deselected' && (
                    <Button
                      type="default"
                      onClick={(e) => handleRemoveMatch(match.id, e)}
                      className="rounded-xl font-bold h-10 px-4"
                    >
                      Xóa khỏi danh sách
                    </Button>
                  )}

                  <Button
                    shape="circle"
                    icon={<ArrowRightOutlined />}
                    className="border-none bg-slate-50 hover:bg-slate-100 flex items-center justify-center w-10 h-10 flex-shrink-0"
                    onClick={() => navigate(`/community/matches/${match.id}`)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-80px)] py-8 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Wave Header / Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 md:p-8 mb-8 overflow-hidden shadow-lg shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-600/30 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
              <CalendarOutlined /> Lịch trình cá nhân
            </div>
            <Title level={2} style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 28 }}>
              Kèo đã chọn 🏸
            </Title>
            <Paragraph style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>
              Theo dõi kèo đấu hôm nay, xác nhận tham gia các kèo đã qua và lưu giữ lịch trình rèn luyện của bạn.
            </Paragraph>
          </div>
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={() => navigate('/user/bookings')}
            className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 text-white font-extrabold rounded-xl h-12 px-6 flex items-center gap-2"
          >
            Lịch sử đặt sân (Nhật ký)
          </Button>
        </div>
        {/* Subtle Decorative Circle */}
        <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%) pointer-events-none rounded-full" />
      </div>

      {/* Tabs list matching Screen 3 */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm">
        <Tabs
          defaultActiveKey="1"
          className="custom-tabs"
          items={[
            {
              key: '1',
              label: (
                <div className="flex items-center gap-2 font-extrabold pb-1">
                  <span>Hôm nay</span>
                  <Badge count={matchesToday.length} showZero={false} overflowCount={9} style={{ backgroundColor: '#ef4444' }} />
                </div>
              ),
              children: renderMatchList(matchesToday, 'Hôm nay'),
            },
            {
              key: '2',
              label: (
                <div className="flex items-center gap-2 font-extrabold pb-1">
                  <span>Sắp tới</span>
                  <Badge count={matchesUpcoming.length} showZero={false} overflowCount={99} style={{ backgroundColor: '#10b981' }} />
                </div>
              ),
              children: renderMatchList(matchesUpcoming, 'Sắp tới'),
            },
            {
              key: '3',
              label: (
                <div className="flex items-center gap-2 font-extrabold pb-1">
                  <span>Cần xác nhận</span>
                  <Badge count={matchesPending.length} showZero={false} style={{ backgroundColor: '#f59e0b' }} />
                </div>
              ),
              children: renderMatchList(matchesPending, 'Cần xác nhận'),
            },
            {
              key: '4',
              label: (
                <div className="flex items-center gap-2 font-extrabold pb-1">
                  <span>Đã tham gia</span>
                  <Badge count={matchesJoined.length} showZero={false} style={{ backgroundColor: '#3b82f6' }} />
                </div>
              ),
              children: renderMatchList(matchesJoined, 'Đã tham gia'),
            },
            {
              key: '5',
              label: (
                <div className="flex items-center gap-2 font-extrabold pb-1">
                  <span>Đã bỏ chọn</span>
                  <Badge count={matchesDeselected.length} showZero={false} style={{ backgroundColor: '#64748b' }} />
                </div>
              ),
              children: renderMatchList(matchesDeselected, 'Đã bỏ chọn'),
            },
          ]}
        />
      </div>

      {/* Complete Rating Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pt-2">
            <StarOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
            <span className="font-extrabold text-slate-800 text-lg">Đánh giá sau buổi chơi 🏸</span>
          </div>
        }
        open={ratingModalOpen}
        onOk={handleSubmitRating}
        onCancel={() => setRatingModalOpen(false)}
        okText="Gửi tất cả đánh giá"
        cancelText="Đóng"
        okButtonProps={{ 
          className: 'bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold h-10 px-6',
          loading: submittingRating 
        }}
        cancelButtonProps={{ className: 'rounded-xl font-bold h-10 px-6' }}
        className="rounded-3xl overflow-hidden"
        width={600}
      >
        <Spin spinning={loadingParticipants} indicator={<LoadingOutlined style={{ fontSize: 24, color: BRAND.primary }} spin />}>
          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto px-1">
            {/* 1. Venue Rating Section */}
            {selectedMatch?.venueId && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Đánh giá sân đấu</span>
                    <Text strong className="text-slate-800 text-sm block">
                      {selectedMatch.venueName || selectedMatch.venueAddress || (selectedMatch as any).location || 'Sân cầu lông'}
                    </Text>
                  </div>
                  <Tag color="success" className="border-none font-bold rounded-md m-0">Địa điểm</Tag>
                </div>
                
                <div className="space-y-1">
                  <Text className="text-slate-600 text-xs block">Chất lượng sân, ánh sáng, lưới và dịch vụ:</Text>
                  <Rate allowHalf value={venueStars} onChange={setVenueStars} className="text-amber-500 text-xl" />
                </div>
                
                <div className="space-y-1">
                  <TextArea
                    rows={2}
                    placeholder="Nhận xét về sân chơi này (Không bắt buộc)..."
                    value={venueComment}
                    onChange={(e) => setVenueComment(e.target.value)}
                    className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 2. Players Rating Section */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Đánh giá bạn chơi ({participants.length})
              </span>
              
              {participants.length === 0 ? (
                <div className="text-center py-4 bg-slate-50 rounded-2xl">
                  <Text type="secondary" className="text-xs">Không có thành viên nào khác tham gia để đánh giá.</Text>
                </div>
              ) : (
                <div className="space-y-4">
                  {participants.map((player) => {
                    const rating = playerRatings[player.userId] || { stars: 5, comment: '' };
                    const playerName = player.userName || (player as any).userFullName || 'Người chơi';
                    return (
                      <div key={player.userId} className="p-4 border border-slate-100 rounded-2xl space-y-3 hover:border-slate-200 transition-all">
                        <div className="flex items-center justify-between">
                          <Space size="middle">
                            <Avatar size={36} src={player.userAvatar} style={{ backgroundColor: BRAND.primary }}>
                              {playerName.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                              <Text strong className="text-slate-800 text-sm block">{playerName}</Text>
                              <Text type="secondary" style={{ fontSize: '10px' }} className="block">Trình độ: {player.userLevel || 'Chưa cập nhật'}</Text>
                            </div>
                          </Space>
                          <Rate 
                            allowHalf 
                            value={rating.stars} 
                            onChange={(val) => {
                              setPlayerRatings(prev => ({
                                ...prev,
                                [player.userId]: { ...prev[player.userId], stars: val }
                              }));
                            }} 
                            className="text-amber-500 text-lg" 
                          />
                        </div>
                        
                        <Input
                          placeholder={`Nhận xét về ${playerName} (ví dụ: chơi nhiệt tình, đúng giờ)...`}
                          value={rating.comment}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPlayerRatings(prev => ({
                              ...prev,
                              [player.userId]: { ...prev[player.userId], comment: val }
                            }));
                          }}
                          className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs h-9"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Spin>
      </Modal>
      </div>
    </div>
  );
}
