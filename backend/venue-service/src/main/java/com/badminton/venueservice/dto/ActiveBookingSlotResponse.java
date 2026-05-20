package com.badminton.venueservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ActiveBookingSlotResponse {
    private UUID id;
    private UUID courtId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime expiresAt;
    private String status;
}
