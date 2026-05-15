package com.badminton.venueservice.dto;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponse {
    private UUID id;
    private UUID ownerId;
    private String name;
    private String slug;
    private String description;
    private String address;
    private String city;
    private String status;
    private Double ratingAvg;
    private Integer ratingCount;
}
