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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueServiceClient {

    private final RestTemplate restTemplate;
    
    @Value("${external.venue-service.url}")
    private String venueServiceUrl;

    public List<VenueDto> getNearbyVenues(double lat, double lng, double radiusKm, int limit) {
        try {
            String url = String.format("%s/api/venues/nearby?lat=%f&lng=%f&radiusKm=%f&limit=%d", 
                    venueServiceUrl, lat, lng, radiusKm, limit);
            
            ResponseEntity<ApiResponse<List<VenueDto>>> response = restTemplate.exchange(
                    url, 
                    HttpMethod.GET, 
                    null, 
                    new ParameterizedTypeReference<ApiResponse<List<VenueDto>>>() {}
            );
            
            return response.getBody() != null ? response.getBody().getResult() : List.of();
        } catch (Exception e) {
            log.error("Error calling venue service: {}", e.getMessage());
            return List.of();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VenueDto {
        private UUID id;
        private String name;
        private String address;
        private Double latitude;
        private Double longitude;
        private Double ratingAvg;
        private Integer ratingCount;
        private Double distanceKm;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private T result;
    }
}