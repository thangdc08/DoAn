package com.badminton.recommendationservice.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${external.community-service.url}")
    private String communityServiceUrl;

    public List<MatchPostDto> getNearbyMatches(double lat, double lng, double radiusKm, int limit) {
        try {
            String url = String.format("%s/api/community/match-posts/nearby?lat=%f&lng=%f&radiusKm=%f&limit=%d", 
                    communityServiceUrl, lat, lng, radiusKm, limit);
            
            ResponseEntity<ApiResponse<List<MatchPostDto>>> response = restTemplate.exchange(
                    url, 
                    HttpMethod.GET, 
                    null, 
                    new ParameterizedTypeReference<ApiResponse<List<MatchPostDto>>>() {}
            );
            
            return response.getBody() != null ? response.getBody().getResult() : List.of();
        } catch (Exception e) {
            log.error("Error calling community service: {}", e.getMessage());
            return List.of();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchPostDto {
        private UUID id;
        private UUID hostId;
        private String title;
        private String level;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String venueName;
        private Double latitude;
        private Double longitude;
        private Integer maxParticipants;
        private Integer currentParticipants;
        private String joinMode;
        private Double distanceKm;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private T result;
    }
}