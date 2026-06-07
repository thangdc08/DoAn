import express from 'express';
import { getUserProfile } from '../clients/userClient.js';
import { getVenuesByCity, getVenueCourts } from '../clients/venueClient.js';
import { getUserBookingHistory } from '../clients/bookingClient.js';
import { scoreVenue } from '../engine/scoringEngine.js';
import { DEFAULT_LIMIT, MIN_SCORE_THRESHOLD } from '../models/venue.model.js';

const router = express.Router();

router.get('/venues', async (req, res) => {
  try {
    const { userId, city = 'Hà Nội', limit = DEFAULT_LIMIT } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số userId',
      });
    }

    const [user, rawVenues, bookingHistory] = await Promise.all([
      getUserProfile(userId),
      getVenuesByCity(city),
      getUserBookingHistory(userId),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng',
      });
    }

    if (rawVenues.length === 0) {
      return res.json({
        success: true,
        message: `Chưa có sân nào ở ${city}`,
        data: [],
      });
    }

    const allPrices = rawVenues
      .map(v => v.defaultPrice)
      .filter(p => p != null && !isNaN(p) && p > 0);

    const enrichedVenues = await Promise.all(
      rawVenues.map(async (venue) => {
        const playedLevels = extractPlayedLevels(venue.id, bookingHistory);
        return { ...venue, playedLevels };
      })
    );

    const scored = enrichedVenues.map((venue) => {
      const result = scoreVenue(user, venue, bookingHistory, allPrices);
      return {
        venue: {
          id: venue.id,
          name: venue.name,
          address: venue.address,
          ward: venue.ward,
          city: venue.city,
          latitude: venue.latitude,
          longitude: venue.longitude,
          ratingAvg: venue.ratingAvg,
          ratingCount: venue.ratingCount,
          defaultPrice: venue.defaultPrice,
          courtCount: venue.courtCount,
          utilities: venue.utilities,
          openTime: venue.openTime,
          closeTime: venue.closeTime,
          images: venue.images,
        },
        ...result,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const sliced = scored
      .filter(item => item.score >= MIN_SCORE_THRESHOLD)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sliced,
      meta: {
        totalCandidates: rawVenues.length,
        returned: sliced.length,
        city,
        userLevel: user.level,
      },
    });
  } catch (err) {
    console.error('[Recommendations] Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống gợi ý',
      error: err.message,
    });
  }
});

function extractPlayedLevels(venueId, bookingHistory) {
  const levelCount = {};
  for (const [vid, info] of Object.entries(bookingHistory)) {
    if (vid === venueId && info.levels && info.levels.length > 0) {
      for (const lv of info.levels) {
        levelCount[lv] = (levelCount[lv] || 0) + 1;
      }
    }
  }
  return Object.entries(levelCount)
    .sort((a, b) => b[1] - a[1])
    .map(([lv]) => lv);
}

export default router;
