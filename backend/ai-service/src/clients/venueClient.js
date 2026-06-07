import axios from 'axios';

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

export async function getVenuesByCity(city) {
  try {
    const res = await axios.get(`${GATEWAY_URL}/api/venues`, {
      params: city ? { city } : undefined,
      timeout: 5000,
    });
    const venues = res.data.result || res.data || [];
    return venues.filter(v => v.status === 'APPROVED' || v.status === 'APPROVED');
  } catch (err) {
    console.error('[VenueClient] Failed to fetch venues:', err.message);
    return [];
  }
}

export async function getVenueCourts(venueId) {
  try {
    const res = await axios.get(
      `${GATEWAY_URL}/api/venues/${venueId}`,
      { timeout: 5000 }
    );
    return res.data.result || res.data || {};
  } catch (err) {
    console.error(`[VenueClient] Failed to fetch venue ${venueId}:`, err.message);
    return null;
  }
}

export function extractDefaultPrice(venueDetail) {
  if (!venueDetail) return null;
  const courts = venueDetail.courts || [];
  if (courts.length > 0) {
    const prices = courts
      .map(c => parseFloat(c.defaultPrice))
      .filter(p => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      return Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100;
    }
  }
  return null;
}
