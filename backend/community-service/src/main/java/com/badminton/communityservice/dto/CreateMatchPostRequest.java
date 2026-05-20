package com.badminton.communityservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMatchPostRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private java.util.UUID venueId;

    @NotNull
    private java.util.UUID hostId; // will be validated against X-Auth-User-Id header

    @NotNull
    @Future
    private LocalDateTime matchTime;

    @Min(1)
    private Integer maxParticipants = 4;
}
