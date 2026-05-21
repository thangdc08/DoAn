package com.badminton.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueRecommendationResponse {
    private UUID venueId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double ratingAvg;
    private Integer ratingCount;
    private Double distanceKm;
    private Double score; // Recommendation score
    private String reason; // Why recommended
}