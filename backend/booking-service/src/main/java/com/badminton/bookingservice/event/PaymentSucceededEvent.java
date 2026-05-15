package com.badminton.bookingservice.event;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentSucceededEvent {
    private UUID eventId;
    private String eventType;
    private UUID bookingId;
    private UUID transactionId;
    private UUID userId;
    private BigDecimal amount;
    private LocalDateTime paidAt;
}
