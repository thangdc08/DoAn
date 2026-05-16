package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePriceRuleRequest {
    private UUID venueId;
    private UUID courtId;
    private Integer dayOfWeek;
    private String startTime; // HH:mm
    private String endTime;   // HH:mm
    private BigDecimal pricePerHour;
    private String status;
}
