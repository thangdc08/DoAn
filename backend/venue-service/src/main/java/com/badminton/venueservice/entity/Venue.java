package com.badminton.venueservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "venues", schema = "venue")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address;

    private String ward;
    private String district;
    private String city;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "geography(Point, 4326)")
    private Point location;

    private String phone;

    private LocalTime openTime;
    
    private LocalTime closeTime;

    @ElementCollection
    @CollectionTable(name = "venue_utilities", joinColumns = @JoinColumn(name = "venue_id"))
    @Column(name = "utility")
    @Builder.Default
    private List<String> utilities = new ArrayList<>();

    @Builder.Default
    private String status = "PENDING_APPROVAL";

    @Builder.Default
    private Double ratingAvg = 0.0;
    @Builder.Default
    private Integer ratingCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
