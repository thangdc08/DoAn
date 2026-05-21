package com.badminton.communityservice.dto;

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
public class PlayerRatingResponse {
    private UUID id;
    private UUID matchPostId;
    private UUID raterId;
    private String raterName; // Optional
    private UUID rateeId;
    private String rateeName; // Optional
    private Integer stars;
    private String comment;
    private LocalDateTime createdAt;
}
