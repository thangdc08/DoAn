package com.badminton.venueservice.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class VenueRatingRequest {
    private Integer stars;
    private String comment;
}
