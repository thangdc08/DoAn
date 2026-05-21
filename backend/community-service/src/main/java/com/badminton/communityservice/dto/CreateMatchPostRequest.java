package com.badminton.communityservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMatchPostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    private String description;

    @NotBlank(message = "Level is required")
    private String level; // BEGINNER | INTERMEDIATE | ADVANCED

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    // Optional venue reference
    private UUID venueId;
    
    // Or manual location
    private String locationText;
    private Double latitude;
    private Double longitude;

    @Min(value = 2, message = "Max participants must be at least 2")
    @Max(value = 20, message = "Max participants cannot exceed 20")
    private Integer maxParticipants = 4;

    @NotBlank(message = "Join mode is required")
    @Pattern(regexp = "OPEN|APPROVAL", message = "Join mode must be OPEN or APPROVAL")
    private String joinMode = "APPROVAL"; // OPEN | APPROVAL

    @Pattern(regexp = "PUBLIC|PRIVATE", message = "Visibility must be PUBLIC or PRIVATE")
    private String visibility = "PUBLIC"; // PUBLIC | PRIVATE
}
