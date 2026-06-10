package com.badminton.bookingservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
  private UUID id;
  private UUID userId;
  private UUID venueId;
  private String venueNameSnapshot;
  private BigDecimal totalAmount;
  private String status;
  private String paymentStatus;
  private LocalDateTime expiresAt;
  private LocalDateTime paidAt;
  private LocalDateTime createdAt;
  private LocalDateTime bookingDate;
  private String customerName;
  private String customerEmail;
  private String courtName;
  private String courtType;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private Boolean checkedIn;
  private java.util.List<com.badminton.bookingservice.entity.BookingItem> items;
}
