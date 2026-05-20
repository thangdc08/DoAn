package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "player_ratings", schema = "community",
        uniqueConstraints = @UniqueConstraint(columnNames = {"match_post_id", "ratee_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlayerRating {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "match_post_id", nullable = false)
    private UUID matchPostId;

    @Column(nullable = false)
    private UUID raterId;   // host

    @Column(nullable = false)
    private UUID rateeId;   // người bị đánh giá

    @Column(nullable = false)
    private Integer stars;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
