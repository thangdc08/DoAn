package com.badminton.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConflictBookingInfo {
    private UUID bookingId;
    private String courtName;
    private String startTime;
    private String endTime;
}
