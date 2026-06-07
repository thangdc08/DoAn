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
public class PayoutApprovedEvent {
    private String eventType; // "PayoutApproved"
    private UUID payoutRequestId;
    private UUID ownerId;
    private BigDecimal amount;
    private String bankName;
    private String bankAccount;
    private String bankAccountName;
    private String adminNotes;
    private java.time.LocalDateTime resolvedAt;
}
