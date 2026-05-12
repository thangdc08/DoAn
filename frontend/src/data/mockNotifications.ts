import type { Notification } from '../types/notification.types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    receiverId: 'user-1',
    type: 'BOOKING_PAID',
    title: 'Đặt sân thành công',
    content: 'Bạn đã đặt sân Thiên Đường lúc 18:00 ngày 20/05/2024 thành công',
    data: {
      bookingId: 'booking-1',
      venueId: '1',
      venueName: 'Sân Cầu Lông Thiên Đường',
    },
    readAt: undefined,
    createdAt: '2024-05-20T17:05:00Z',
  },
  {
    id: 'notif-2',
    receiverId: 'user-1',
    type: 'MATCH_JOIN_REQUESTED',
    title: 'Có người muốn tham gia kèo của bạn',
    content: 'Nguyễn Văn B muốn tham gia kèo "Tìm 2 người chơi đôi tối nay"',
    data: {
      matchId: 'match-1',
      userId: 'user-2',
      userName: 'Nguyễn Văn B',
    },
    readAt: '2024-05-20T18:00:00Z',
    createdAt: '2024-05-20T17:30:00Z',
  },
  {
    id: 'notif-3',
    receiverId: 'user-1',
    type: 'RATING_CREATED',
    title: 'Bạn nhận được đánh giá mới',
    content: 'Trần Thị C đã đánh giá bạn 5 sao sau trận đấu',
    data: {
      ratingId: 'rating-1',
      score: 5,
      raterId: 'user-3',
    },
    readAt: undefined,
    createdAt: '2024-05-19T20:00:00Z',
  },
];
