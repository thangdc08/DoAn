import apiClient from './apiClient';
import type {
  MatchPost,
  MatchParticipant,
  Comment,
  Report,
  CreateMatchPostRequest,
  FacebookPost,
} from '../types/community.types';

export const communityApi = {
  unwrapResult: <T>(response: { data: { result?: T } }): T => {
    if (response.data.result === undefined) {
      throw new Error('Phan hoi tu may chu khong hop le.');
    }
    return response.data.result;
  },

  // Match Posts
  getMatchPosts: async (params?: {
    q?: string;
    level?: string;
    levels?: string;
    status?: string;
    joinMode?: string;
    fromTime?: string;
    toTime?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    size?: number;
  }): Promise<{ content: MatchPost[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/communities/api/community/match-posts', { params });
    return communityApi.unwrapResult(response);
  },

  getMyMatches: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: MatchPost[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/communities/api/community/match-posts/my', { params });
    return communityApi.unwrapResult(response);
  },

  getJoinedMatches: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: MatchPost[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/communities/api/community/match-posts/joined', { params });
    return communityApi.unwrapResult(response);
  },

  getMatchPostById: async (matchId: string): Promise<MatchPost> => {
    const response = await apiClient.get(`/communities/api/community/match-posts/${matchId}`);
    return communityApi.unwrapResult(response);
  },

  createMatchPost: async (data: CreateMatchPostRequest): Promise<MatchPost> => {
    const response = await apiClient.post('/communities/api/community/match-posts', data);
    return communityApi.unwrapResult(response);
  },

  updateMatchPost: async (matchId: string, data: Partial<CreateMatchPostRequest>): Promise<MatchPost> => {
    const response = await apiClient.put(`/communities/api/community/match-posts/${matchId}`, data);
    return communityApi.unwrapResult(response);
  },

  deleteMatchPost: async (matchId: string): Promise<void> => {
    await apiClient.delete(`/communities/api/community/match-posts/${matchId}`);
  },

  // Participants
  joinMatch: async (matchId: string): Promise<MatchParticipant> => {
    const response = await apiClient.post(`/communities/api/community/match-posts/${matchId}/join`);
    return communityApi.unwrapResult(response);
  },

  getMatchParticipants: async (matchId: string): Promise<MatchParticipant[]> => {
    const response = await apiClient.get(`/communities/api/community/match-posts/${matchId}/participants`);
    return communityApi.unwrapResult(response);
  },

  approveParticipant: async (matchId: string, participantId: string): Promise<void> => {
    await apiClient.post(`/communities/api/community/match-posts/${matchId}/participants/${participantId}/approve`);
  },

  rejectParticipant: async (matchId: string, participantId: string): Promise<void> => {
    await apiClient.post(`/communities/api/community/match-posts/${matchId}/participants/${participantId}/reject`);
  },

  closeMatch: async (matchId: string): Promise<void> => {
    await apiClient.post(`/communities/api/community/match-posts/${matchId}/close`);
  },

  leaveMatch: async (matchId: string): Promise<void> => {
    await apiClient.post(`/communities/api/community/match-posts/${matchId}/leave`);
  },

  finishMatch: async (matchId: string): Promise<void> => {
    await apiClient.post(`/communities/api/community/match-posts/${matchId}/finish`);
  },

  // Comments
  getComments: async (matchId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/community/matches/${matchId}/comments`);
    return response.data;
  },

  createComment: async (matchId: string, content: string): Promise<Comment> => {
    const response = await apiClient.post(`/community/matches/${matchId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (matchId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/community/matches/${matchId}/comments/${commentId}`);
  },

  // Likes
  likeMatch: async (matchId: string): Promise<void> => {
    await apiClient.post(`/community/matches/${matchId}/like`);
  },

  unlikeMatch: async (matchId: string): Promise<void> => {
    await apiClient.delete(`/community/matches/${matchId}/like`);
  },

  // Ratings
  ratePlayer: async (
    matchId: string,
    data: {
      rateeUserId: string;
      stars: number;
      comment?: string;
    }
  ): Promise<any> => {
    const response = await apiClient.post(`/communities/api/community/match-posts/${matchId}/ratings`, data);
    return communityApi.unwrapResult(response);
  },

  getPlayerRating: async (matchId: string, rateeId: string): Promise<any> => {
    const response = await apiClient.get(`/communities/api/community/match-posts/${matchId}/ratings/${rateeId}`);
    return communityApi.unwrapResult(response);
  },

  // Reports
  createReport: async (data: {
    reportedUserId?: string;
    reportedMatchPostId?: string;
    reportedCommentId?: string;
    reason: string;
    description: string;
  }): Promise<Report> => {
    const response = await apiClient.post('/community/reports', data);
    return response.data;
  },

  // Admin APIs
  getReports: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Report[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/reports', { params });
    return communityApi.unwrapResult(response);
  },

  resolveReport: async (reportId: string, action: string): Promise<void> => {
    await apiClient.patch(`/admin/reports/${reportId}/resolve`, { action });
  },

  // Facebook Scraped Posts
  getFacebookPosts: async (): Promise<FacebookPost[]> => {
    const response = await apiClient.get<FacebookPost[]>('/fb-community/api/community/posts');
    return response.data;
  },
  scrapeFacebookPosts: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/fb-community/api/community/scrape');
    return response.data;
  },
  
  // Weather Recommendation
  getWeatherRecommendation: async (lat: number, lng: number): Promise<any> => {
    const response = await apiClient.get('/recommendations/api/recommendations/weather', {
      params: { lat, lng }
    });
    return communityApi.unwrapResult(response);
  },
};
