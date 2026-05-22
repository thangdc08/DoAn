package com.badminton.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "booking_items", schema = "booking")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "booking_id", nullable = false)
    private UUID bookingId;

    @Column(name = "venue_id", nullable = false)
    private UUID venueId;

    @Column(name = "venue_name_snapshot", nullable = false)
    private String venueNameSnapshot;

    @Column(name = "court_id", nullable = false)
    private UUID courtId;

    @Column(name = "court_name_snapshot", nullable = false)
    private String courtNameSnapshot;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "price_snapshot", nullable = false)
    private BigDecimal priceSnapshot;

    @Column(name = "price_snapshot_vnd", nullable = false)
    private BigDecimal priceSnapshotVnd;

    @Builder.Default
    private String status = "PENDING";

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
