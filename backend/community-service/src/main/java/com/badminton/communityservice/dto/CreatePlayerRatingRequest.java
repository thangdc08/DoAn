package com.badminton.communityservice.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePlayerRatingRequest {
    @NotNull(message = "Ratee user ID is required")
    private UUID rateeUserId;
    
    @NotNull(message = "Stars rating is required")
    @Min(value = 1, message = "Stars must be at least 1")
    @Max(value = 5, message = "Stars cannot exceed 5")
    private Integer stars;
    
    private String comment;
}
