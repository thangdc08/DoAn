package com.badminton.paymentservice.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_callbacks", schema = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentCallback {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 private UUID id;

 private UUID transactionId;

 @Column(nullable = false)
 private String provider;

 @Column(nullable = false, columnDefinition = "JSONB")
 @JdbcTypeCode(SqlTypes.JSON)
 private JsonNode rawPayload;

 @Column(nullable = false)
 private Boolean signatureValid;

 @Builder.Default
 private Boolean handled = false;

 @CreationTimestamp
 private LocalDateTime receivedAt;
}
