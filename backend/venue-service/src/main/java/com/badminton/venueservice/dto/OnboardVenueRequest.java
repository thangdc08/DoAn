package com.badminton.venueservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardVenueRequest {
    @NotBlank(message = "Venue name is required")
    private String venueName;

    @NotBlank(message = "Address is required")
    private String address;
    private String ward;

    @NotBlank(message = "City is required")
    private String city;

    private String phone;
    private String email;

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
