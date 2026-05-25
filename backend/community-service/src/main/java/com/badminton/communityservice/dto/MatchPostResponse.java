package com.badminton.communityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchPostResponse {
    private UUID id;
    private UUID hostId;
    private String hostName; // Optional: fetch from identity service
    private String title;
    private String description;
    private String level;
    private List<String> levels;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String venueName;
    private String venueAddress;
    private Double latitude;
    private Double longitude;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private String joinMode;
    private String status;
    private Integer likeCount;
    private Integer commentCount;
    private String genderPreference;
    private String paymentType;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Distance for nearby queries (optional)
    private Double distanceKm;
}
