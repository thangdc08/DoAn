package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_posts", schema = "community")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MatchPost {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID hostId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    private String venueName;
    private String venueAddress;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "geography(Point, 4326)")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Point location;

    @Builder.Default
    private Integer maxParticipants = 4;

    @Builder.Default
    private Integer currentParticipants = 1;

    @Column(nullable = false)
    @Builder.Default
    private String joinMode = "APPROVAL"; // OPEN | APPROVAL

    @Builder.Default
    private String status = "OPEN"; // OPEN | CLOSED | FINISHED | CANCELLED

    @Builder.Default
    private Integer likeCount = 0;

    @Builder.Default
    private Integer commentCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
