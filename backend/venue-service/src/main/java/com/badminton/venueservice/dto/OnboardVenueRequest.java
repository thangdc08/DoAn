package com.badminton.venueservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalTime;
import java.util.List;

@Data
public class OnboardVenueRequest {
    @NotBlank(message = "Venue name is required")
    private String venueName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "Court count is required")
    private Integer courtCount;

    private List<String> utilities;

    @NotNull(message = "Open time is required")
    private LocalTime openTime;

    @NotNull(message = "Close time is required")
    private LocalTime closeTime;

    private List<FlexiblePriceDTO> pricing;
}
