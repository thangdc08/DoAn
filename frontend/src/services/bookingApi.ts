import apiClient from './apiClient';
import type {
  Booking,
  CourtAvailability,
  LockSlotRequest,
  LockSlotResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  SupportTicket,
} from '../types/booking.types';

export const bookingApi = {
  // Get court availability for a specific date
  getAvailability: async (params: {
    venueId: string;
    courtId?: string;
    date: string;
  }): Promise<CourtAvailability[]> => {
    const response = await apiClient.get('/bookings/availability', { params });
    return response.data;
  },

  // Lock time slots
  lockSlots: async (data: LockSlotRequest): Promise<LockSlotResponse> => {
    const response = await apiClient.post('/bookings/locks', data);
    return response.data;
  },

  // Create booking from locked slots
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  // Get my bookings
  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Booking[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/bookings/my', { params });
    return response.data;
  },

  // Get booking detail
  getBookingById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Create support ticket
  createSupportTicket: async (
    bookingId: string,
    data: { subject: string; description: string }
  ): Promise<SupportTicket> => {
    const response = await apiClient.post(`/bookings/${bookingId}/support-tickets`, data);
    return response.data;
  },

  // Owner APIs
  getOwnerBookings: async (params?: {
    venueId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Booking[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/owner/bookings', { params });
    return response.data;
  },

  getRevenue: async (params?: {
    venueId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalRevenue: number;
    bookingCount: number;
    chartData: Array<{ date: string; revenue: number; count: number }>;
  }> => {
    const response = await apiClient.get('/owner/revenue', { params });
    return response.data;
  },

  getSupportTickets: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: SupportTicket[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/owner/support-tickets', { params });
    return response.data;
  },

  replySupportTicket: async (ticketId: string, reply: string): Promise<SupportTicket> => {
    const response = await apiClient.patch(`/owner/support-tickets/${ticketId}/reply`, { reply });
    return response.data;
  },
};
