package com.badminton.paymentservice.event;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentFailedEvent {
    private UUID eventId;
    private String eventType;        // "PaymentFailed"
    private UUID bookingId;
    private UUID transactionId;
    private UUID userId;
    private BigDecimal amount;
    private String failureReason;    // e.g. "VNPAY_REFUSED", "MOCK_FAILED"
    private LocalDateTime failedAt;
}
