package com.badminton.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchRecommendationResponse {
    private UUID matchPostId;
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
    private Double score; // Recommendation score
    private String reason; // Why recommended
}