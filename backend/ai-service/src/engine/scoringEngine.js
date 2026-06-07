import { getLevelScore, LEVEL_ORDER } from '../models/level.config.js';
import { SCORE_WEIGHTS } from '../models/venue.model.js';
import { scoreDistance, haversine } from './distance.js';

export function scoreVenue(user, venue, bookingHistory, allVenuePrices) {
  const breakdown = {};

  breakdown.distance = computeDistanceScore(user, venue);
  breakdown.level = computeLevelScore(user, venue);
  breakdown.rating = computeRatingScore(venue);
  breakdown.price = computePriceScore(venue, allVenuePrices);
  breakdown.history = computeHistoryScore(venue.id, bookingHistory);

  const score =
    breakdown.distance * SCORE_WEIGHTS.distance +
    breakdown.level * SCORE_WEIGHTS.level +
    breakdown.rating * SCORE_WEIGHTS.rating +
    breakdown.price * SCORE_WEIGHTS.price +
    breakdown.history * SCORE_WEIGHTS.history;

  return {
    score: Math.round(score * 100) / 100,
    breakdown,
  };
}

function computeDistanceScore(user, venue) {
  if (!user.preferredAreas || user.preferredAreas.length === 0) {
    return 40;
  }
  if (venue.latitude == null || venue.longitude == null) return 30;

  let minKm = Infinity;
  for (const area of user.preferredAreas) {
    if (area.lat == null || area.lng == null) continue;
    const d = haversine(area.lat, area.lng, venue.latitude, venue.longitude);
    if (d != null && d < minKm) minKm = d;
  }
  if (minKm === Infinity) return 40;
  return scoreDistance(minKm);
}

function computeLevelScore(user, venue) {
  const playedLevels = (venue.playedLevels || []).filter(l => LEVEL_ORDER.includes(l));
  const userLevel = user.level;

  if (!userLevel) return 40;
  if (playedLevels.length === 0) return 40;

  return getLevelScore(userLevel, playedLevels[0]);
}

function computeRatingScore(venue) {
  if (venue.ratingAvg == null) return 30;
  const raw = (venue.ratingAvg / 5) * 100;
  let bonus = 0;
  if ((venue.ratingCount || 0) >= 10) bonus = 5;
  return Math.min(100, Math.round(raw + bonus));
}

function computePriceScore(venue, allVenuePrices) {
  if (!venue.defaultPrice || !allVenuePrices || allVenuePrices.length === 0) return 50;
  const avg = allVenuePrices.reduce((a, b) => a + b, 0) / allVenuePrices.length;
  const ratio = venue.defaultPrice / avg;

  if (ratio < 0.8) return 100;
  if (ratio <= 1.2) return Math.round(100 - (ratio - 0.8) * 150);
  return 40;
}

function computeHistoryScore(venueId, bookingHistory) {
  const count = bookingHistory[venueId]?.count || 0;
  if (count === 0) return 0;
  if (count === 1) return 50;
  return Math.min(100, 50 + count * 10);
}
