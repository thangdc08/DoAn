import axios from 'axios';

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

export async function getUserBookingHistory(userId) {
  try {
    const res = await axios.get(
      `${GATEWAY_URL}/api/bookings/my`,
      {
        params: { userId, page: 0, size: 50 },
        headers: { 'X-Auth-User-Id': userId },
        timeout: 5000,
      }
    );
    const page = res.data.result || res.data || {};
    const bookings = page.content || [];
    const venueStats = {};
    for (const b of bookings) {
      if (!b.venueId) continue;
      if (!venueStats[b.venueId]) {
        venueStats[b.venueId] = { count: 0, name: b.venueNameSnapshot };
      }
      venueStats[b.venueId].count += 1;
    }
    return venueStats;
  } catch (err) {
    console.error(`[BookingClient] Failed to fetch bookings for ${userId}:`, err.message);
    return {};
  }
}
