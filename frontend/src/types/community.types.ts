export interface MatchPost {
  id: string;
  hostId: string;
  hostName?: string;
  title: string;
  description?: string;
  venueId?: string;
  venueName?: string;
  venueAddress?: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  endTime: string;
  level: string;
  maxParticipants: number;
  currentParticipants: number;
  joinMode?: string;
  status: string;
  likeCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CrawlPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  status: 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';
  crawledAt: string;
  publishedAt?: string;
}

export interface MatchParticipant {
  id: string;
  matchPostId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  respondedAt?: string;
}

export interface Comment {
  id: string;
  matchPostId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  raterId: string;
  raterName: string;
  ratedUserId: string;
  matchPostId?: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedMatchPostId?: string;
  reportedCommentId?: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

export interface CreateMatchPostRequest {
  title: string;
  description: string;
  level: string;
  startTime: string;
  endTime: string;
  venueId?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  maxParticipants: number;
  joinMode: 'OPEN' | 'APPROVAL';
  visibility: 'PUBLIC' | 'PRIVATE';
}
