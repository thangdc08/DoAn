import axios from 'axios';

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8080';

export async function getUserProfile(userId) {
  try {
    const res = await axios.get(
      `${GATEWAY_URL}/identity/api/v1/users/${userId}`,
      { timeout: 5000 }
    );
    const data = res.data;
    return {
      id: data.id,
      level: data.level || null,
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      preferredAreas: data.preferredAreas || [],
      availabilities: data.availabilities || [],
    };
  } catch (err) {
    console.error(`[UserClient] Failed to fetch user ${userId}:`, err.message);
    return null;
  }
}
