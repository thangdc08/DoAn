package com.badminton.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "support_tickets", schema = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicket {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  @Column(nullable = true)
  private UUID bookingId;

  @Column(nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private String subject;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Builder.Default
  @Column(nullable = false)
  private String status = "OPEN"; // OPEN | IN_PROGRESS | RESOLVED | CLOSED

  @Column(columnDefinition = "TEXT")
  private String reply;

  private LocalDateTime repliedAt;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
