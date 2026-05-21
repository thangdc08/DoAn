package com.badminton.communityservice.service;

import com.badminton.communityservice.entity.MatchPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "community.events";

    public void publishMatchPostCreated(MatchPost matchPost) {
        MatchPostCreatedEvent event = MatchPostCreatedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("MatchPostCreated")
                .occurredAt(LocalDateTime.now())
                .producer("community-service")
                .version(1)
                .matchPostId(matchPost.getId())
                .hostId(matchPost.getHostId())
                .title(matchPost.getTitle())
                .startTime(matchPost.getStartTime())
                .build();
        
        kafkaTemplate.send(TOPIC, matchPost.getId().toString(), event);
        log.info("Published MatchPostCreated event for match {}", matchPost.getId());
    }

    public void publishMatchJoinRequested(UUID matchPostId, UUID userId, UUID hostId) {
        MatchJoinRequestedEvent event = MatchJoinRequestedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("MatchJoinRequested")
                .occurredAt(LocalDateTime.now())
                .producer("community-service")
                .version(1)
                .matchPostId(matchPostId)
                .userId(userId)
                .hostId(hostId)
                .build();
        
        kafkaTemplate.send(TOPIC, matchPostId.toString(), event);
        log.info("Published MatchJoinRequested event for match {} by user {}", matchPostId, userId);
    }

    public void publishMatchApproved(UUID matchPostId, UUID userId, UUID hostId) {
        MatchApprovedEvent event = MatchApprovedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("MatchApproved")
                .occurredAt(LocalDateTime.now())
                .producer("community-service")
                .version(1)
                .matchPostId(matchPostId)
                .userId(userId)
                .hostId(hostId)
                .build();
        
        kafkaTemplate.send(TOPIC, matchPostId.toString(), event);
        log.info("Published MatchApproved event for match {} user {}", matchPostId, userId);
    }

    public void publishRatingCreated(UUID matchPostId, UUID raterId, UUID rateeId, Integer stars) {
        RatingCreatedEvent event = RatingCreatedEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType("RatingCreated")
                .occurredAt(LocalDateTime.now())
                .producer("community-service")
                .version(1)
                .matchPostId(matchPostId)
                .raterId(raterId)
                .rateeUserId(rateeId)
                .stars(stars)
                .build();
        
        kafkaTemplate.send(TOPIC, rateeId.toString(), event);
        log.info("Published RatingCreated event for user {} with {} stars", rateeId, stars);
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class MatchPostCreatedEvent {
        private UUID eventId;
        private String eventType;
        private LocalDateTime occurredAt;
        private String producer;
        private Integer version;
        private UUID matchPostId;
        private UUID hostId;
        private String title;
        private LocalDateTime startTime;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class MatchJoinRequestedEvent {
        private UUID eventId;
        private String eventType;
        private LocalDateTime occurredAt;
        private String producer;
        private Integer version;
        private UUID matchPostId;
        private UUID userId;
        private UUID hostId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class MatchApprovedEvent {
        private UUID eventId;
        private String eventType;
        private LocalDateTime occurredAt;
        private String producer;
        private Integer version;
        private UUID matchPostId;
        private UUID userId;
        private UUID hostId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class RatingCreatedEvent {
        private UUID eventId;
        private String eventType;
        private LocalDateTime occurredAt;
        private String producer;
        private Integer version;
        private UUID matchPostId;
        private UUID raterId;
        private UUID rateeUserId;
        private Integer stars;
    }
}
