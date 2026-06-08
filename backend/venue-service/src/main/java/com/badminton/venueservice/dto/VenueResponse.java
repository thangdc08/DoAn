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
    private String ward;
    private String city;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String email;
    private String status;
    private Double ratingAvg;
    private Integer ratingCount;
    private java.util.List<String> utilities;
    private String openTime;
    private String closeTime;
    private String policy;
    private Integer courtCount;
    private java.math.BigDecimal priceMin;
    private java.math.BigDecimal priceMax;
    private java.util.List<VenueImageResponse> images;
    private String currentUserRole;
}
