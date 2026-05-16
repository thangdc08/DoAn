package com.badminton.venueservice.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateVenueRequest {
    private String name;
    private String description;
    private String address;
    private String ward;
    private String city;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String email;
    private Integer courtCount;
    private String openTime;
    private String closeTime;
    private List<String> utilities;
    private String policy;
}
