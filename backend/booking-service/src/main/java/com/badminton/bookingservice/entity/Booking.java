package com.badminton.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings", schema = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
@Id
@GeneratedValue(strategy = GenerationType.AUTO)
private UUID id;

@Column(nullable = false)
private UUID userId;

@Column(nullable = false)
private UUID venueId;

@Column(nullable = false)
private String venueNameSnapshot;

@Column(nullable = false)
private BigDecimal totalAmount;

@Column(name = "total_amount_vnd", nullable = false)
private BigDecimal totalAmountVnd;

@Builder.Default
private String status = "PENDING";

@Builder.Default
private String paymentStatus = "UNPAID";

@Column(nullable = false)
private LocalDateTime expiresAt;

private LocalDateTime paidAt;

@CreationTimestamp
private LocalDateTime createdAt;

@UpdateTimestamp
private LocalDateTime updatedAt;

@Column(nullable = true)
private LocalDateTime bookingDate;

@Column(nullable = true)
private String customerName;

@Column(nullable = true)
private String customerEmail;

@Column(nullable = true)
private String courtName;

@Column(nullable = true)
private String courtType;

@Column(nullable = true)
private LocalDateTime startTime;

@Column(nullable = true)
private LocalDateTime endTime;

@Builder.Default
private Boolean checkedIn = false;

@Builder.Default
@Column(name = "owner_reminder_sent", nullable = false)
private Boolean ownerReminderSent = false;

@Builder.Default
@Column(name = "player_reminder_sent", nullable = false)
private Boolean playerReminderSent = false;
}
