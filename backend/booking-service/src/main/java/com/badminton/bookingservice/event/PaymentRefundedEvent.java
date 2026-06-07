package com.badminton.bookingservice.event;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRefundedEvent {
    private UUID eventId;
    private String eventType;        // "PaymentRefunded"
    private UUID bookingId;
    private UUID transactionId;
    private UUID userId;
    private UUID venueId;
    private UUID ownerId;
    private BigDecimal amount;       // gross amount refunded
    private BigDecimal netAmount;    // after commission deduction
    private LocalDateTime refundedAt;
}
