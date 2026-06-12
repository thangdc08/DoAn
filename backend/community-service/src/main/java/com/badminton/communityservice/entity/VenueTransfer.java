package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "venue_transfers", schema = "community")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueTransfer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID sellerId;

    private UUID buyerId;

    @Column(nullable = false)
    private String venueName;

    private String courtName;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private BigDecimal originalPrice;

    @Column(nullable = false)
    private BigDecimal transferPrice;

    @Column(nullable = false)
    @Builder.Default
    private String status = "OPEN"; // OPEN | COMPLETED | CANCELLED

    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String note;

    private UUID bookingId; // Link to actual booking in booking-service

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
