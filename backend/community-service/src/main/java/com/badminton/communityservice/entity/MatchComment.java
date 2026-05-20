package com.badminton.communityservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_comments", schema = "community")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MatchComment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "match_post_id", nullable = false)
    private UUID matchPostId;

    @Column(nullable = false)
    private UUID userId;

    private String userFullName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
