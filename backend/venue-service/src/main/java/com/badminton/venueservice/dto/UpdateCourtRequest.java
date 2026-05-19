package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourtRequest {
    private String name;
    private String courtType;
    private String description;
    private String status;
    private BigDecimal defaultPrice;
}
