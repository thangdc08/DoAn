package com.badminton.communityservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueTransferResponse {
    private UUID id;
    private UUID sellerId;
    private UUID buyerId;
    private String venueName;
    private String courtName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal originalPrice;
    private BigDecimal transferPrice;
    private String status;
    private String contactPhone;
    private String note;
    private UUID bookingId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
