package com.badminton.recommendationservice.service;

import com.badminton.recommendationservice.client.CommunityServiceClient;
import com.badminton.recommendationservice.client.VenueServiceClient;
import com.badminton.recommendationservice.client.WeatherServiceClient;
import com.badminton.recommendationservice.document.UserActivity;
import com.badminton.recommendationservice.dto.MatchRecommendationResponse;
import com.badminton.recommendationservice.dto.VenueRecommendationResponse;
import com.badminton.recommendationservice.dto.WeatherRecommendationResponse;
import com.badminton.recommendationservice.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final VenueServiceClient venueServiceClient;
    private final CommunityServiceClient communityServiceClient;
    private final UserActivityRepository userActivityRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final WeatherServiceClient weatherServiceClient;

    public List<VenueRecommendationResponse> recommendVenues(UUID userId, double lat, double lng, double radiusKm, int limit) {
        log.info("Getting venue recommendations for user {} at ({}, {})", userId, lat, lng);
        
        // Check cache first
        String cacheKey = String.format("venue_rec:%s:%.4f:%.4f:%.1f:%d", userId, lat, lng, radiusKm, limit);
        List<VenueRecommendationResponse> cached = (List<VenueRecommendationResponse>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Returning cached venue recommendations");
            return cached;
        }

        // Get nearby venues
        List<VenueServiceClient.VenueDto> nearbyVenues = venueServiceClient.getNearbyVenues(lat, lng, radiusKm, limit * 2);
        
        // Get user activity for personalization
        Optional<UserActivity> userActivity = userActivityRepository.findByUserId(userId);
        
        // Calculate recommendations with scoring
        List<VenueRecommendationResponse> recommendations = nearbyVenues.stream()
                .map(venue -> calculateVenueScore(venue, userActivity.orElse(null), lat, lng))
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());
        
        // Cache for 10 minutes
        redisTemplate.opsForValue().set(cacheKey, recommendations, 10, TimeUnit.MINUTES);
        
        log.info("Generated {} venue recommendations", recommendations.size());
        return recommendations;
    }

    public List<MatchRecommendationResponse> recommendMatches(UUID userId, double lat, double lng, double radiusKm, int limit) {
        log.info("Getting match recommendations for user {} at ({}, {})", userId, lat, lng);
        
        // Check cache first
        String cacheKey = String.format("match_rec:%s:%.4f:%.4f:%.1f:%d", userId, lat, lng, radiusKm, limit);
        List<MatchRecommendationResponse> cached = (List<MatchRecommendationResponse>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Returning cached match recommendations");
            return cached;
        }

        // Get nearby matches
        List<CommunityServiceClient.MatchPostDto> nearbyMatches = communityServiceClient.getNearbyMatches(lat, lng, radiusKm, limit * 2);
        
        // Get user activity for personalization
        Optional<UserActivity> userActivity = userActivityRepository.findByUserId(userId);
        
        // Calculate recommendations with scoring
        List<MatchRecommendationResponse> recommendations = nearbyMatches.stream()
                .filter(match -> match.getStartTime().isAfter(LocalDateTime.now())) // Only future matches
                .filter(match -> match.getCurrentParticipants() < match.getMaxParticipants()) // Not full
                .map(match -> calculateMatchScore(match, userActivity.orElse(null), lat, lng))
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());
        
        // Cache for 5 minutes (shorter for matches due to time sensitivity)
        redisTemplate.opsForValue().set(cacheKey, recommendations, 5, TimeUnit.MINUTES);
        
        log.info("Generated {} match recommendations", recommendations.size());
        return recommendations;
    }

    private VenueRecommendationResponse calculateVenueScore(VenueServiceClient.VenueDto venue, UserActivity userActivity, double userLat, double userLng) {
        double score = 0.0;
        List<String> reasons = new ArrayList<>();

        // Base score from rating
        if (venue.getRatingAvg() != null) {
            score += venue.getRatingAvg() * 20; // Max 100 points from rating
            if (venue.getRatingAvg() >= 4.0) {
                reasons.add("Đánh giá cao (" + venue.getRatingAvg() + "⭐)");
            }
        }

        // Distance factor (closer is better)
        if (venue.getDistanceKm() != null) {
            double distanceScore = Math.max(0, 50 - venue.getDistanceKm() * 5); // Max 50 points, -5 per km
            score += distanceScore;
            if (venue.getDistanceKm() <= 2.0) {
                reasons.add("Gần bạn (" + String.format("%.1f", venue.getDistanceKm()) + "km)");
            }
        }

        // User history bonus
        if (userActivity != null && userActivity.getVenueBookings() != null) {
            boolean hasBookedBefore = userActivity.getVenueBookings().stream()
                    .anyMatch(booking -> booking.getVenueId().equals(venue.getId()));
            if (hasBookedBefore) {
                score += 30;
                reasons.add("Bạn đã từng đặt sân ở đây");
            }
        }

        // Popular venue bonus
        if (venue.getRatingCount() != null && venue.getRatingCount() > 50) {
            score += 20;
            reasons.add("Sân phổ biến (" + venue.getRatingCount() + " đánh giá)");
        }

        return VenueRecommendationResponse.builder()
                .venueId(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .latitude(venue.getLatitude())
                .longitude(venue.getLongitude())
                .ratingAvg(venue.getRatingAvg())
                .ratingCount(venue.getRatingCount())
                .distanceKm(venue.getDistanceKm())
                .score(score)
                .reason(String.join(", ", reasons))
                .build();
    }

    private MatchRecommendationResponse calculateMatchScore(CommunityServiceClient.MatchPostDto match, UserActivity userActivity, double userLat, double userLng) {
        double score = 0.0;
        List<String> reasons = new ArrayList<>();

        // Time factor (sooner matches get higher score, but not too soon)
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilMatch = java.time.Duration.between(now, match.getStartTime()).toHours();
        if (hoursUntilMatch >= 2 && hoursUntilMatch <= 48) {
            double timeScore = Math.max(0, 50 - Math.abs(hoursUntilMatch - 24) * 2); // Peak at 24 hours
            score += timeScore;
            if (hoursUntilMatch <= 6) {
                reasons.add("Sắp diễn ra (" + hoursUntilMatch + "h nữa)");
            }
        }

        // Distance factor
        if (match.getDistanceKm() != null) {
            double distanceScore = Math.max(0, 40 - match.getDistanceKm() * 4);
            score += distanceScore;
            if (match.getDistanceKm() <= 3.0) {
                reasons.add("Gần bạn (" + String.format("%.1f", match.getDistanceKm()) + "km)");
            }
        }

        // Level matching
        if (userActivity != null && userActivity.getPreferredLevel() != null) {
            if (userActivity.getPreferredLevel().equals(match.getLevel())) {
                score += 40;
                reasons.add("Phù hợp trình độ (" + match.getLevel() + ")");
            }
        }

        // Availability factor (not too full, not too empty)
        double fillRatio = (double) match.getCurrentParticipants() / match.getMaxParticipants();
        if (fillRatio >= 0.3 && fillRatio <= 0.8) {
            score += 30;
            reasons.add("Số người vừa phải (" + match.getCurrentParticipants() + "/" + match.getMaxParticipants() + ")");
        }

        // Join mode preference (OPEN matches are easier)
        if ("OPEN".equals(match.getJoinMode())) {
            score += 20;
            reasons.add("Tham gia tự do");
        }

        return MatchRecommendationResponse.builder()
                .matchPostId(match.getId())
                .hostId(match.getHostId())
                .title(match.getTitle())
                .level(match.getLevel())
                .startTime(match.getStartTime())
                .endTime(match.getEndTime())
                .venueName(match.getVenueName())
                .latitude(match.getLatitude())
                .longitude(match.getLongitude())
                .maxParticipants(match.getMaxParticipants())
                .currentParticipants(match.getCurrentParticipants())
                .joinMode(match.getJoinMode())
                .distanceKm(match.getDistanceKm())
                .score(score)
                .reason(String.join(", ", reasons))
                .build();
    }

    public WeatherRecommendationResponse getWeatherRecommendation(double lat, double lng) {
        log.info("Calculating weather recommendation for ({}, {})", lat, lng);
        
        WeatherServiceClient.WeatherData data = weatherServiceClient.fetchWeatherData(lat, lng);
        
        int score = 100;
        
        // 1. Temperature deductions
        if (data.getTemperature() > 38.0) {
            score -= 35; // Nắng nóng gay gắt
        } else if (data.getTemperature() > 35.0) {
            score -= 20; // Nhiệt độ rất cao
        } else if (data.getTemperature() < 15.0) {
            score -= 15; // Trời lạnh
        }
        
        // 2. Humidity deductions
        if (data.getHumidity() > 90.0) {
            score -= 40; // Độ ẩm cực cao
        } else if (data.getHumidity() > 80.0) {
            score -= 25; // Độ ẩm rất cao
        }
        
        // 3. Wind Speed deductions
        if (data.getWindSpeed() > 25.0) {
            score -= 35; // Gió quá to
        } else if (data.getWindSpeed() > 15.0) {
            score -= 20; // Gió mạnh
        }
        
        // 4. UV Index deductions
        if (data.getUvIndex() > 10.0) {
            score -= 25; // UV cực độ
        } else if (data.getUvIndex() > 7.0) {
            score -= 15; // UV độc hại
        }
        
        // 5. AQI deductions
        if (data.getAqi() > 200) {
            score -= 50; // Ô nhiễm nghiêm trọng
        } else if (data.getAqi() > 150) {
            score -= 30; // Ô nhiễm trung bình
        }
        
        // 6. PM2.5 deductions
        if (data.getPm25() > 75.0) {
            score -= 20; // Bụi mịn cao
        }

        // Capping scores based on severe health or safety conditions
        if (data.getAqi() >= 180 || data.getHumidity() >= 95.0 || data.getWindSpeed() >= 30.0) {
            score = 0;
        } else if (data.getAqi() >= 150) {
            score = Math.min(score, 30);
        }
        
        // Clamp score between 0 and 100
        score = Math.max(0, Math.min(100, score));
        
        String status;
        String advice;
        
        if (score >= 80) {
            status = "Lý tưởng";
            advice = "Thời tiết tuyệt vời để ra sân chơi cầu ngay!";
        } else if (score >= 50) {
            if (data.getAqi() > 100) {
                status = "Không khí nhạy cảm";
                advice = "Không khí hơi kém, nhóm nhạy cảm nên cẩn trọng.";
            } else {
                status = "Cân nhắc kỹ";
                advice = "Điều kiện thời tiết trung bình, chú ý bảo vệ sức khỏe.";
            }
        } else {
            if (data.getAqi() >= 150 || data.getPm25() > 75.0) {
                status = "Không khí xấu";
                advice = "Rủi ro cao, nên nhắn chủ kèo trước khi đi.";
            } else if (data.getHumidity() > 85.0) {
                status = "Trời ẩm ướt";
                advice = "Độ ẩm cao gây trơn trượt trên sân, chú ý chấn thương.";
            } else {
                status = "Thời tiết xấu";
                advice = "Thời tiết xấu, khuyên bạn nên chơi trong nhà hoặc đổi ngày.";
            }
        }
        
        return WeatherRecommendationResponse.builder()
                .temperature(data.getTemperature())
                .humidity(data.getHumidity())
                .windSpeed(data.getWindSpeed())
                .uvIndex(data.getUvIndex())
                .aqi(data.getAqi())
                .pm25(data.getPm25())
                .score(score)
                .status(status)
                .advice(advice)
                .build();
    }
}