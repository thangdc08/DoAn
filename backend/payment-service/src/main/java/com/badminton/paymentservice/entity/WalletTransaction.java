package com.badminton.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallet_transactions", schema = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    private String type; // CREDIT, DEBIT, PAYOUT_APPROVED, PAYOUT_REJECTED, REFUND

    @Column(nullable = false, length = 50)
    private String status; // SUCCESS, FAILED

    @Column(length = 255)
    private String description;

    @Column
    private UUID relatedTransactionId;

    @Column
    private UUID relatedPayoutRequestId;

    @Column(nullable = false)
    private BigDecimal balanceBefore;

    @Column(nullable = false)
    private BigDecimal balanceAfter;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
