package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtResponse {
    private UUID id;
    private String name;
    private String courtType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer displayOrder;
}
