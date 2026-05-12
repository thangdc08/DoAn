export interface Notification {
  id: string;
  receiverId: string;
  type: 'BOOKING_PAID' | 'BOOKING_EXPIRED' | 'MATCH_JOIN_REQUESTED' | 'MATCH_APPROVED' | 'MATCH_REJECTED' | 'RATING_CREATED' | 'VENUE_APPROVED' | 'VENUE_REJECTED';
  title: string;
  content: string;
  data?: Record<string, any>;
  readAt?: string;
  createdAt: string;
}

export interface NotificationCount {
  unreadCount: number;
}
