package com.badminton.venueservice.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueRatingRequest {
    private Integer stars;
    private String comment;
    private java.util.List<String> images;
}
