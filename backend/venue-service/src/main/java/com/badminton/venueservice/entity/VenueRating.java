package com.badminton.venueservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "venue_ratings", schema = "venue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueRating {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID venueId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private Integer stars;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
