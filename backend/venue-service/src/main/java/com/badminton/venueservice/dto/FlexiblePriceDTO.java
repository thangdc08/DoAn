package com.badminton.venueservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlexiblePriceDTO {
    @NotNull(message = "Start time is required")
    private LocalTime from;

    @NotNull(message = "End time is required")
    private LocalTime to;

    @NotNull(message = "Price is required")
    private BigDecimal price;
}
