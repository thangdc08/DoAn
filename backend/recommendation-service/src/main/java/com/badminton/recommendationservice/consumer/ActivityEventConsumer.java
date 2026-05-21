package com.badminton.recommendationservice.consumer;

import com.badminton.recommendationservice.document.UserActivity;
import com.badminton.recommendationservice.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityEventConsumer {

    private final UserActivityRepository userActivityRepository;

    @KafkaListener(topics = "booking-events", groupId = "recommendation-group")
    public void handleBookingEvent(Map<String, Object> event) {
        log.info("Received booking event for recommendation: {}", event);
        
        if (event.containsKey("paidAt")) { // Only track successful bookings
            UUID userId = UUID.fromString(event.get("userId").toString());
            String venueName = event.getOrDefault("venueName", "").toString();
            
            // Update user activity
            UserActivity activity = userActivityRepository.findByUserId(userId)
                    .orElse(UserActivity.builder()
                            .userId(userId)
                            .venueBookings(new ArrayList<>())
                            .matchParticipations(new ArrayList<>())
                            .build());
            
            // Add or update venue booking
            // Note: In real implementation, you'd need venue coordinates from venue service
            UserActivity.VenueBooking venueBooking = UserActivity.VenueBooking.builder()
                    .venueName(venueName)
                    .bookingCount(1)
                    .lastBookedAt(LocalDateTime.now())
                    .build();
            
            if (activity.getVenueBookings() == null) {
                activity.setVenueBookings(new ArrayList<>());
            }
            activity.getVenueBookings().add(venueBooking);
            activity.setUpdatedAt(LocalDateTime.now());
            
            userActivityRepository.save(activity);
            log.info("Updated user activity for booking: userId={}", userId);
        }
    }

    @KafkaListener(topics = "community.events", groupId = "recommendation-group")
    public void handleCommunityEvent(Map<String, Object> event) {
        log.info("Received community event for recommendation: {}", event);
        
        String eventType = event.get("eventType").toString();
        
        if ("MatchApproved".equals(eventType)) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
            
            // Update user activity
            UserActivity activity = userActivityRepository.findByUserId(userId)
                    .orElse(UserActivity.builder()
                            .userId(userId)
                            .venueBookings(new ArrayList<>())
                            .matchParticipations(new ArrayList<>())
                            .build());
            
            // Add match participation
            UserActivity.MatchParticipation participation = UserActivity.MatchParticipation.builder()
                    .matchPostId(matchPostId)
                    .participatedAt(LocalDateTime.now())
                    .build();
            
            if (activity.getMatchParticipations() == null) {
                activity.setMatchParticipations(new ArrayList<>());
            }
            activity.getMatchParticipations().add(participation);
            activity.setUpdatedAt(LocalDateTime.now());
            
            userActivityRepository.save(activity);
            log.info("Updated user activity for match participation: userId={}, matchId={}", userId, matchPostId);
        }
    }
}