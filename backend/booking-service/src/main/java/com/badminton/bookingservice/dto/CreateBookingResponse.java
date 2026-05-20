package com.badminton.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingResponse {
    private UUID bookingId;
    private String status;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private LocalDateTime expiresAt;
    private String venueNameSnapshot;
    private List<Item> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private UUID id;
        private String courtNameSnapshot;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private BigDecimal priceSnapshot;
    }
}
