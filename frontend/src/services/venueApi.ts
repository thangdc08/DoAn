import apiClient from './apiClient';
import type {
  Venue,
  Court,
  PriceRule,
  CreateVenueRequest,
  UpdateVenueRequest,
} from '../types/venue.types';

const unwrapResult = <T>(response: { data: { result?: T } }): T => {
  if (response.data.result === undefined) {
    throw new Error('Phản hồi từ máy chủ không hợp lệ.');
  }
  return response.data.result;
};

export const venueApi = {
  // Public APIs
  getVenues: async (params?: {
    search?: string;
    city?: string;
    district?: string;
    latitude?: number;
    longitude?: number;
    page?: number;
    size?: number;
  }): Promise<{ content: Venue[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/venues/api/venues', { params });
    return unwrapResult(response);
  },

  getNearbyVenues: async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
  }): Promise<Venue[]> => {
    const response = await apiClient.get('/venues/api/venues/nearby', { params });
    return unwrapResult(response);
  },

  getVenueById: async (venueId: string): Promise<Venue> => {
    const response = await apiClient.get(`/venues/api/venues/${venueId}`);
    return unwrapResult(response);
  },

  getVenueCourts: async (venueId: string): Promise<Court[]> => {
    const response = await apiClient.get(`/venues/api/venues/${venueId}/courts`);
    return unwrapResult(response);
  },

  // Owner APIs
  createVenue: async (data: CreateVenueRequest): Promise<Venue> => {
    const response = await apiClient.post('/venues/api/venues', data);
    return unwrapResult(response);
  },

  updateVenue: async (venueId: string, data: UpdateVenueRequest): Promise<Venue> => {
    const response = await apiClient.put(`/venues/api/venues/${venueId}`, data);
    return unwrapResult(response);
  },

  deleteVenue: async (venueId: string): Promise<void> => {
    await apiClient.delete(`/venues/api/venues/${venueId}`);
  },

  getMyVenues: async (): Promise<Venue[]> => {
    const response = await apiClient.get('/venues/api/venues/my');
    return unwrapResult<Venue[]>(response);
  },

  createCourt: async (venueId: string, data: { name: string; courtType: string }): Promise<Court> => {
    const response = await apiClient.post(`/venues/api/venues/${venueId}/courts`, data);
    return unwrapResult(response);
  },

  updateCourt: async (venueId: string, courtId: string, data: Partial<Court>): Promise<Court> => {
    const response = await apiClient.put(`/venues/api/venues/${venueId}/courts/${courtId}`, data);
    return unwrapResult(response);
  },

  deleteCourt: async (venueId: string, courtId: string): Promise<void> => {
    await apiClient.delete(`/venues/api/venues/${venueId}/courts/${courtId}`);
  },

  reorderCourts: async (venueId: string, courtIds: string[]): Promise<void> => {
    await apiClient.put(`/venues/api/venues/${venueId}/courts/reorder`, courtIds);
  },

  createPriceRule: async (venueId: string, data: Omit<PriceRule, 'id' | 'createdAt'>): Promise<PriceRule> => {
    const response = await apiClient.post(`/venues/api/venues/${venueId}/price-rules`, data);
    return unwrapResult(response);
  },

  getPriceRules: async (venueId: string): Promise<PriceRule[]> => {
    const response = await apiClient.get(`/venues/api/venues/${venueId}/price-rules`);
    return unwrapResult(response);
  },

  updatePriceRule: async (venueId: string, ruleId: string, data: Partial<PriceRule>): Promise<PriceRule> => {
    const response = await apiClient.put(`/venues/api/venues/${venueId}/price-rules/${ruleId}`, data);
    return unwrapResult(response);
  },

  deletePriceRule: async (venueId: string, ruleId: string): Promise<void> => {
    await apiClient.delete(`/venues/api/venues/${venueId}/price-rules/${ruleId}`);
  },

  uploadVenueImages: async (venueId: string, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    await apiClient.post(`/venues/api/venues/${venueId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteVenueImage: async (venueId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/venues/api/venues/${venueId}/images/${imageId}`);
  },

  // Admin APIs
  getPendingVenues: async (): Promise<Venue[]> => {
    const response = await apiClient.get('/venues/api/admin/venues/pending');
    return unwrapResult(response);
  },

  approveVenue: async (venueId: string): Promise<void> => {
    await apiClient.patch(`/venues/api/admin/venues/${venueId}/approve`);
  },

  rejectVenue: async (venueId: string, reason: string): Promise<void> => {
    await apiClient.patch(`/venues/api/admin/venues/${venueId}/reject`, { reason });
  },
};
