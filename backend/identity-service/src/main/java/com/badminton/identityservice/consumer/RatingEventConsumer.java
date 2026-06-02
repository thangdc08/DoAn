package com.badminton.identityservice.consumer;

import com.badminton.identityservice.entity.ProcessedEvent;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.repository.ProcessedEventRepository;
import com.badminton.identityservice.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class RatingEventConsumer {

    private final UserRepository userRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "community.events", groupId = "identity-group")
    @Transactional
    public void consume(String message) {
        log.info("Received Kafka message in identity-service: {}", message);
        try {
            RatingCreatedEvent event = objectMapper.readValue(message, RatingCreatedEvent.class);
            if (!"RatingCreated".equals(event.getEventType())) {
                return;
            }

            if (processedEventRepository.existsById(event.getEventId())) {
                log.warn("Event {} already processed. Skipping.", event.getEventId());
                return;
            }

            processRating(event);
            saveProcessedEvent(event.getEventId(), event.getEventType());
        } catch (Exception e) {
            log.error("Failed to process rating event message", e);
        }
    }

    private void processRating(RatingCreatedEvent event) {
        User user = userRepository.findById(event.getRateeUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + event.getRateeUserId()));

        double currentRating = user.getRating() != null ? user.getRating() : 0.0;
        int currentCount = user.getReviewCount() != null ? user.getReviewCount() : 0;

        double newRating = calculateNewRating(currentRating, currentCount, event.getStars());
        
        user.setRating(newRating);
        user.setReviewCount(currentCount + 1);
        
        userRepository.save(user);
        log.info("Updated reputation for user {}: rating={}, reviewCount={}", 
                user.getId(), newRating, currentCount + 1);
    }

    private double calculateNewRating(double currentRating, int currentCount, int newStars) {
        return (currentRating * currentCount + newStars) / (currentCount + 1);
    }

    private void saveProcessedEvent(UUID eventId, String eventType) {
        ProcessedEvent processedEvent = ProcessedEvent.builder()
                .eventId(eventId)
                .eventType(eventType)
                .processedAt(LocalDateTime.now())
                .build();
        processedEventRepository.save(processedEvent);
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RatingCreatedEvent {
        private UUID eventId;
        private String eventType;
        private UUID rateeUserId;
        private Integer stars;
    }
}
