package com.badminton.communityservice.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVenueTransferRequest {
    @NotBlank(message = "Venue name is required")
    private String venueName;

    private String courtName;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotNull(message = "Original price is required")
    @PositiveOrZero(message = "Original price must be positive or zero")
    private BigDecimal originalPrice;

    @NotNull(message = "Transfer price is required")
    @PositiveOrZero(message = "Transfer price must be positive or zero")
    private BigDecimal transferPrice;

    @Pattern(regexp = "^$|^0\\d{9,10}$", message = "Contact phone must be a valid Vietnamese phone number")
    private String contactPhone;

    private String note;

    private UUID bookingId; // Link to system booking
}
