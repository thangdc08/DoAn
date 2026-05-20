package com.badminton.venueservice.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueRatingResponse {
    private UUID id;
    private UUID venueId;
    private UUID userId;
    private Integer stars;
    private String comment;
    private LocalDateTime createdAt;
}
