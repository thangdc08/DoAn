package com.badminton.bookingservice.dto;

import lombok.Data;

import java.util.UUID;
import java.time.LocalTime;

@Data
public class VenueInternalResponse {
    private UUID id;
    private UUID ownerId;
    private String name;
    private String policy;
    private LocalTime openTime;
    private LocalTime closeTime;
}
