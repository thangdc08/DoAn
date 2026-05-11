package com.badminton.venueservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "price_rules", schema = "venue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PriceRule {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID venueId;

    private UUID courtId;

    private Integer dayOfWeek; // 1 (Mon) - 7 (Sun)

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private BigDecimal pricePerHour;

    @Builder.Default
    private String status = "ACTIVE";

    @CreationTimestamp
    private LocalDateTime createdAt;
}
