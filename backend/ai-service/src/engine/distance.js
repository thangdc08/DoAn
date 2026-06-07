import { DISTANCE_THRESHOLDS } from '../models/venue.model.js';

const R = 6371;

export function haversine(lat1, lng1, lat2, lng2) {
  if (
    lat1 == null || lng1 == null || lat2 == null || lng2 == null ||
    isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)
  ) {
    return null;
  }
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function scoreDistance(distanceKm) {
  if (distanceKm == null) return 30;
  for (const t of DISTANCE_THRESHOLDS) {
    if (distanceKm <= t.maxKm) return t.score;
  }
  return 10;
}
