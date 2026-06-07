/**
 * Venue domain types — dùng chung giữa VenueList, VenueCard, VenueDetail, và Map.
 */

export type CourtResult = {
  id: string;
  name: string;
  address: string;
  district: string;
  distance: string;
  posts: number;
  rating: number;
  position: [number, number];
  badge?: number;
  active?: boolean;
};

// Complete Venue types for backend integration
export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  slug?: string;
  description?: string;
  address: string;
  ward?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  ratingAvg: number;
  ratingCount: number;
  images?: VenueImage[];
  amenities?: Amenity[];
  utilities?: string[];
  courts?: Court[];
  businessHours?: BusinessHour[];
  priceRange?: string;
  priceMin?: number;
  priceMax?: number;
  distance?: number;
  policy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Court {
  id: string;
  venueId: string;
  name: string;
  courtType: 'STANDARD' | 'PREMIUM' | 'VIP';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  defaultPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VenueImage {
  id: string;
  venueId: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
}

export interface Amenity {
  id: string;
  code: string;
  name: string;
  icon?: string;
}

export interface BusinessHour {
  id: string;
  venueId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface PriceRule {
  id: string;
  venueId: string;
  courtId?: string;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface VenueClosedDay {
  id: string;
  venueId: string;
  closedDate: string;
  reason?: string;
  createdAt: string;
}

export interface CreateVenueRequest {
  name: string;
  description?: string;
  address: string;
  ward?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  courtCount?: number;
  openTime?: string;
  closeTime?: string;
  utilities?: string[];
}

export interface UpdateVenueRequest {
  name?: string;
  description?: string;
  address?: string;
  ward?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  utilities?: string[];
  status?: string;
  policy?: string;
}

export interface UpdateCourtAvailabilityRequest {
  startDate: string;
  endDate: string;
  availableSlots: string[]; // e.g., ["05:00", "05:30", "06:00"]
}
