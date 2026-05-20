package com.badminton.bookingservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ActiveSlotLockResponse {
    private UUID id;
    private UUID courtId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime expiresAt;
    private String status;
}
