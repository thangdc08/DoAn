package com.badminton.venueservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "venue_images", schema = "venue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID venueId;

    @Column(nullable = false)
    private String imageUrl;

    private Integer displayOrder;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
