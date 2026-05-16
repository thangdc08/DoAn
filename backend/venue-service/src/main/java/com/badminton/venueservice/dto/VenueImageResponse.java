package com.badminton.venueservice.dto;

import lombok.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueImageResponse {
    private UUID id;
    private UUID venueId;
    private String imageUrl;
    private Integer displayOrder;
    private LocalDateTime createdAt;
}
