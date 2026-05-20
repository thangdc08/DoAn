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
public class LockSlotsRequest {
    private UUID venueId;
    private UUID courtId;
    private List<SlotTimeRequest> slots;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SlotTimeRequest {
        private LocalDateTime startTime;
        private LocalDateTime endTime;
    }
}

