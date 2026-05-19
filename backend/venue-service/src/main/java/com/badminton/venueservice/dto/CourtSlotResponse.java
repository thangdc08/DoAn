package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtSlotResponse {
    private String startTime;
    private String endTime;
    private String status;
    private java.math.BigDecimal price;
}
