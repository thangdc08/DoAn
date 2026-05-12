import apiClient from './apiClient';
import type {
  MatchPost,
  MatchParticipant,
  Comment,
  Rating,
  Report,
  CreateMatchPostRequest,
} from '../types/community.types';

export const communityApi = {
  // Match Posts
  getMatchPosts: async (params?: {
    level?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    size?: number;
  }): Promise<{ content: MatchPost[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/community/matches', { params });
    return response.data;
  },

  getMatchPostById: async (matchId: string): Promise<MatchPost> => {
    const response = await apiClient.get(`/community/matches/${matchId}`);
    return response.data;
  },

  createMatchPost: async (data: CreateMatchPostRequest): Promise<MatchPost> => {
    const response = await apiClient.post('/community/matches', data);
    return response.data;
  },

  updateMatchPost: async (matchId: string, data: Partial<CreateMatchPostRequest>): Promise<MatchPost> => {
    const response = await apiClient.put(`/community/matches/${matchId}`, data);
    return response.data;
  },

  deleteMatchPost: async (matchId: string): Promise<void> => {
    await apiClient.delete(`/community/matches/${matchId}`);
  },

  // Participants
  joinMatch: async (matchId: string): Promise<MatchParticipant> => {
    const response = await apiClient.post(`/community/matches/${matchId}/join`);
    return response.data;
  },

  getMatchParticipants: async (matchId: string): Promise<MatchParticipant[]> => {
    const response = await apiClient.get(`/community/matches/${matchId}/participants`);
    return response.data;
  },

  approveParticipant: async (matchId: string, participantId: string): Promise<void> => {
    await apiClient.patch(`/community/matches/${matchId}/participants/${participantId}/approve`);
  },

  rejectParticipant: async (matchId: string, participantId: string): Promise<void> => {
    await apiClient.patch(`/community/matches/${matchId}/participants/${participantId}/reject`);
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
  rateUser: async (data: {
    ratedUserId: string;
    matchPostId?: string;
    score: number;
    comment?: string;
  }): Promise<Rating> => {
    const response = await apiClient.post('/community/ratings', data);
    return response.data;
  },

  getUserRatings: async (userId: string): Promise<Rating[]> => {
    const response = await apiClient.get(`/community/ratings/user/${userId}`);
    return response.data;
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
    return response.data;
  },

  resolveReport: async (reportId: string, action: string): Promise<void> => {
    await apiClient.patch(`/admin/reports/${reportId}/resolve`, { action });
  },
};
