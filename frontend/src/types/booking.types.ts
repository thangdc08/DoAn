export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  venueNameSnapshot: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CONFIRMED' | 'FAILED' | 'EXPIRED' | 'CANCELLED_BY_ADMIN' | 'CANCELLED_BY_USER' | 'CANCELLED_BY_OWNER';
  paymentStatus: 'UNPAID' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  expiresAt: string;
  paidAt?: string;
  bookingDate: string;
  customerName: string;
  customerEmail: string;
  courtName: string;
  courtType: string;
  startTime: string;
  endTime: string;
  checkedIn: boolean;
  items: BookingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  venueId: string;
  courtId: string;
  courtNameSnapshot: string;
  startTime: string;
  endTime: string;
  priceSnapshot: number;
  status: 'PENDING' | 'BOOKED' | 'FAILED' | 'EXPIRED';
  createdAt: string;
}

export interface SlotLock {
  id: string;
  userId: string;
  venueId: string;
  courtId: string;
  startTime: string;
  endTime: string;
  status: 'LOCKED' | 'RELEASED' | 'EXPIRED' | 'CONVERTED_TO_BOOKING';
  expiresAt: string;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
  price?: number;
}

export interface CourtAvailability {
  courtId: string;
  courtName: string;
  slots: TimeSlot[];
}

export interface LockSlotRequest {
  venueId: string;
  courtId: string;
  slots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface LockSlotResponse {
  lockIds: string[];
  expiresAt: string;
  status: string;
}

export interface CreateBookingRequest {
  lockIds: string[];
}

export interface CreateBookingResponse {
  bookingId: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  expiresAt: string;
  venueNameSnapshot: string;
  items: {
    id: string;
    courtNameSnapshot: string;
    startTime: string;
    endTime: string;
    priceSnapshot: number;
  }[];
}

export interface SupportTicket {
  id: string;
  bookingId: string;
  userId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}
