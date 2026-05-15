package com.badminton.venueservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class FlexiblePriceDTO {
    @NotNull(message = "Start time is required")
    private LocalTime from;

    @NotNull(message = "End time is required")
    private LocalTime to;

    @NotNull(message = "Price is required")
    private BigDecimal price;
}
