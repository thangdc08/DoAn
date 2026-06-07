package com.badminton.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "owner_wallets", schema = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OwnerWallet {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 private UUID id;

 @Column(nullable = false, unique = true)
 private UUID ownerId;

 @Column(nullable = false)
 @Builder.Default
 private BigDecimal balance = BigDecimal.ZERO;

 @Column(nullable = false)
 @Builder.Default
 private BigDecimal totalEarned = BigDecimal.ZERO;

 @Column(nullable = false)
 @Builder.Default
 private BigDecimal totalWithdrawn = BigDecimal.ZERO;

 @Version
 @Column(nullable = false)
 @Builder.Default
 private Integer version = 0;

 @CreationTimestamp
 @Column(name = "created_at", nullable = false, updatable = false)
 private LocalDateTime createdAt;

 @UpdateTimestamp
 @Column(name = "updated_at")
 private LocalDateTime updatedAt;
}
