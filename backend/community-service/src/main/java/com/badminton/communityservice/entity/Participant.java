package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "participants", schema = "community",
        uniqueConstraints = @UniqueConstraint(columnNames = {"match_post_id", "user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "match_post_id", nullable = false)
    private UUID matchPostId;

    @Column(nullable = false)
    private UUID userId;

    private String userFullName;

    @Builder.Default
    private String status = "PENDING"; // PENDING | APPROVED | REJECTED | CANCELLED_BY_USER | REMOVED_BY_HOST

    @CreationTimestamp
    private LocalDateTime joinedAt;
}
