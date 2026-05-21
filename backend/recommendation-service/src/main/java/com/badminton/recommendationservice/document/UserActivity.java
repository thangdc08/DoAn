package com.badminton.recommendationservice.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "user_activities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserActivity {
    @Id
    private String id;

    @Indexed(unique = true)
    private UUID userId;

    // Booking history for venue recommendations
    private List<VenueBooking> venueBookings;
    
    // Match participation for match recommendations
    private List<MatchParticipation> matchParticipations;
    
    // User preferences
    private String preferredLevel; // BEGINNER | INTERMEDIATE | ADVANCED
    private List<String> preferredAreas;
    private Double preferredPriceMin;
    private Double preferredPriceMax;
    
    // Location for nearby recommendations
    private Double lastLatitude;
    private Double lastLongitude;
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VenueBooking {
        private UUID venueId;
        private String venueName;
        private Double latitude;
        private Double longitude;
        private Integer bookingCount;
        private LocalDateTime lastBookedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchParticipation {
        private UUID matchPostId;
        private String level;
        private Double latitude;
        private Double longitude;
        private LocalDateTime participatedAt;
    }
}