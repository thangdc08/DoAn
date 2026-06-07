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

const unwrapResult = <T>(response: { data: { result?: T } }): T => {
  if (response.data.result === undefined) {
    throw new Error('Phản hồi từ máy chủ không hợp lệ.');
  }
  return response.data.result;
};

export const bookingApi = {
  // Get court availability for a specific date
  getAvailability: async (params: {
    venueId: string;
    courtId?: string;
    date: string;
  }): Promise<CourtAvailability[]> => {
    const response = await apiClient.get('/bookings/api/bookings/availability', { params });
    return unwrapResult(response);
  },

  // Lock time slots
  lockSlots: async (data: LockSlotRequest): Promise<LockSlotResponse> => {
    const response = await apiClient.post('/bookings/api/bookings/locks', data);
    return unwrapResult(response);
  },

  getActiveLocks: async (params: {
    courtId: string;
    date: string;
  }): Promise<Array<{
    id: string;
    courtId: string;
    startTime: string;
    endTime: string;
    expiresAt: string;
  }>> => {
    const response = await apiClient.get('/bookings/api/bookings/locks/active', { params });
    return unwrapResult(response);
  },

  // Create booking from locked slots
  createBooking: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const response = await apiClient.post('/bookings/api/bookings', data);
    return unwrapResult(response);
  },

  // Get my bookings
  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: Booking[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/bookings/api/bookings/my', { params });
    return unwrapResult(response);
  },

  // Get booking detail
  getBookingById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/api/bookings/${bookingId}`);
    return unwrapResult(response);
  },

  // Create support ticket
  createSupportTicket: async (
    bookingId: string,
    data: { subject: string; description: string }
  ): Promise<SupportTicket> => {
    const response = await apiClient.post(`/bookings/api/bookings/${bookingId}/support-tickets`, data);
    return unwrapResult(response);
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
    const response = await apiClient.get('/bookings/api/owner/bookings', { params });
    return unwrapResult(response);
  },

  getRevenue: async (params?: {
    venueId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalRevenue: number;
    totalBookings: number;
    paidBookings: number;
    pendingBookings: number;
    failedBookings: number;
    fromDate: string;
    toDate: string;
    venueBreakdown: Array<{ venueId: string; venueName: string; revenue: number; bookingCount: number }>;
    dailyBreakdown: Array<{ date: string; revenue: number; bookingCount: number }>;
  }> => {
    const response = await apiClient.get('/bookings/api/owner/bookings/revenue', { params });
    return unwrapResult(response);
  },

  getAdminRevenue: async (params?: {
    venueId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalRevenue: number;
    totalBookings: number;
    paidBookings: number;
    pendingBookings: number;
    failedBookings: number;
    fromDate: string;
    toDate: string;
    venueBreakdown: Array<{ venueId: string; venueName: string; revenue: number; bookingCount: number }>;
    dailyBreakdown: Array<{ date: string; revenue: number; bookingCount: number }>;
  }> => {
    const response = await apiClient.get('/bookings/api/admin/bookings/revenue', { params });
    return unwrapResult(response);
  },

  getSupportTickets: async (params?: {
    status?: string;
    page?: number;
    size?: number;
  }): Promise<{ content: SupportTicket[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/bookings/api/owner/support-tickets', { params });
    return unwrapResult(response);
  },

  replySupportTicket: async (ticketId: string, reply: string): Promise<SupportTicket> => {
    const response = await apiClient.patch(`/bookings/api/owner/support-tickets/${ticketId}/reply`, { reply });
    return unwrapResult(response);
  },
};
