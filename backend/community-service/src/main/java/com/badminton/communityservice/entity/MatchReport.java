package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_reports", schema = "community")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MatchReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "match_post_id", nullable = false)
    private UUID matchPostId;

    @Column(nullable = false)
    private UUID reporterId;

    @Column(nullable = false)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Builder.Default
    private String status = "PENDING"; // PENDING | REVIEWED | RESOLVED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
