package com.badminton.bookingservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class VenueInternalResponse {
    private UUID id;
    private UUID ownerId;
    private String name;
}
