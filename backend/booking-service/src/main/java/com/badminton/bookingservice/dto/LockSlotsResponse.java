package com.badminton.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LockSlotsResponse {
    private List<UUID> lockIds;
    private LocalDateTime expiresAt;
    private String status;
}

