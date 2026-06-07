package com.badminton.paymentservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutRejectedEvent {
    private String eventType; // "PayoutRejected"
    private UUID payoutRequestId;
    private UUID ownerId;
    private BigDecimal amount;
    private String adminNotes;
    private String rejectionReason;
    private java.time.LocalDateTime resolvedAt;
}
