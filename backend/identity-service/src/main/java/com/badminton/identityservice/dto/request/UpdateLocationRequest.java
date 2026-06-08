package com.badminton.identityservice.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLocationRequest {

    @NotNull(message = "Latitude không được để trống")
    @DecimalMin(value = "-90.0", message = "Latitude phải >= -90")
    @DecimalMax(value = "90.0",  message = "Latitude phải <= 90")
    private Double latitude;

    @NotNull(message = "Longitude không được để trống")
    @DecimalMin(value = "-180.0", message = "Longitude phải >= -180")
    @DecimalMax(value = "180.0",  message = "Longitude phải <= 180")
    private Double longitude;
}
