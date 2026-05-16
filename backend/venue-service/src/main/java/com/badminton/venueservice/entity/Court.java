package com.badminton.venueservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courts", schema = "venue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Venue venue;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private String courtType = "STANDARD";

    @Builder.Default
    private String status = "ACTIVE";

    private Integer displayOrder;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
