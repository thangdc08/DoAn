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
