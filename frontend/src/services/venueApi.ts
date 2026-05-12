import apiClient from './apiClient';
import type {
  Venue,
  Court,
  PriceRule,
  CreateVenueRequest,
  UpdateVenueRequest,
} from '../types/venue.types';

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
    const response = await apiClient.get('/venues', { params });
    return response.data;
  },

  getNearbyVenues: async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
  }): Promise<Venue[]> => {
    const response = await apiClient.get('/venues/nearby', { params });
    return response.data;
  },

  getVenueById: async (venueId: string): Promise<Venue> => {
    const response = await apiClient.get(`/venues/${venueId}`);
    return response.data;
  },

  getVenueCourts: async (venueId: string): Promise<Court[]> => {
    const response = await apiClient.get(`/venues/${venueId}/courts`);
    return response.data;
  },

  // Owner APIs
  createVenue: async (data: CreateVenueRequest): Promise<Venue> => {
    const response = await apiClient.post('/owner/venues', data);
    return response.data;
  },

  updateVenue: async (venueId: string, data: UpdateVenueRequest): Promise<Venue> => {
    const response = await apiClient.put(`/owner/venues/${venueId}`, data);
    return response.data;
  },

  getMyVenues: async (): Promise<Venue[]> => {
    const response = await apiClient.get('/owner/venues');
    return response.data;
  },

  createCourt: async (venueId: string, data: { name: string; courtType: string }): Promise<Court> => {
    const response = await apiClient.post(`/owner/venues/${venueId}/courts`, data);
    return response.data;
  },

  updateCourt: async (venueId: string, courtId: string, data: Partial<Court>): Promise<Court> => {
    const response = await apiClient.put(`/owner/venues/${venueId}/courts/${courtId}`, data);
    return response.data;
  },

  deleteCourt: async (venueId: string, courtId: string): Promise<void> => {
    await apiClient.delete(`/owner/venues/${venueId}/courts/${courtId}`);
  },

  createPriceRule: async (venueId: string, data: Omit<PriceRule, 'id' | 'createdAt'>): Promise<PriceRule> => {
    const response = await apiClient.post(`/owner/venues/${venueId}/price-rules`, data);
    return response.data;
  },

  getPriceRules: async (venueId: string): Promise<PriceRule[]> => {
    const response = await apiClient.get(`/owner/venues/${venueId}/price-rules`);
    return response.data;
  },

  updatePriceRule: async (venueId: string, ruleId: string, data: Partial<PriceRule>): Promise<PriceRule> => {
    const response = await apiClient.put(`/owner/venues/${venueId}/price-rules/${ruleId}`, data);
    return response.data;
  },

  deletePriceRule: async (venueId: string, ruleId: string): Promise<void> => {
    await apiClient.delete(`/owner/venues/${venueId}/price-rules/${ruleId}`);
  },

  uploadVenueImages: async (venueId: string, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    await apiClient.post(`/owner/venues/${venueId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Admin APIs
  getPendingVenues: async (): Promise<Venue[]> => {
    const response = await apiClient.get('/admin/venues/pending');
    return response.data;
  },

  approveVenue: async (venueId: string): Promise<void> => {
    await apiClient.patch(`/admin/venues/${venueId}/approve`);
  },

  rejectVenue: async (venueId: string, reason: string): Promise<void> => {
    await apiClient.patch(`/admin/venues/${venueId}/reject`, { reason });
  },
};
