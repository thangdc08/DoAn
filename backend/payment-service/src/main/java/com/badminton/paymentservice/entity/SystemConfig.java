package com.badminton.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "system_configs", schema = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SystemConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String configKey;

    @Column(columnDefinition = "TEXT")
    private String configValue;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
}
