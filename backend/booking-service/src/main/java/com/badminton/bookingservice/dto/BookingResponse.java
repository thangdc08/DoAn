package com.badminton.bookingservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private UUID id;
    private UUID userId;
    private UUID venueId;
    private String venueNameSnapshot;
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private LocalDateTime expiresAt;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private java.util.List<com.badminton.bookingservice.entity.BookingItem> items;
}
