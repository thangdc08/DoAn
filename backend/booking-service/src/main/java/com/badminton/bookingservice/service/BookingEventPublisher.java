package com.badminton.bookingservice.service;

import com.badminton.bookingservice.entity.OutboxEvent;
import com.badminton.bookingservice.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    public void publishBookingCreated(BookingCreatedEvent event) {
        saveToOutbox(event.getBookingId(), "Booking", "BookingCreated", event);
    }

    public void publishBookingPaid(BookingPaidEvent event) {
        saveToOutbox(event.getBookingId(), "Booking", "BookingPaid", event);
    }

    public void publishBookingExpired(BookingExpiredEvent event) {
        saveToOutbox(event.getBookingId(), "Booking", "BookingExpired", event);
    }

    private void saveToOutbox(UUID aggregateId, String aggregateType, String eventType, Object payloadObj) {
        try {
            String payload = objectMapper.writeValueAsString(payloadObj);
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .aggregateId(aggregateId)
                    .aggregateType(aggregateType)
                    .eventType(eventType)
                    .payload(payload)
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();
            outboxEventRepository.save(outboxEvent);
            log.info("Saved outbox event {} for aggregate {} to database", eventType, aggregateId);
        } catch (Exception e) {
            log.error("Failed to save event to outbox", e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }
    }

    @Data
    @Builder
    public static class BookingCreatedEvent {
        private UUID bookingId;
        private UUID userId;
        private UUID ownerId;
        private String venueName;
        private java.math.BigDecimal totalAmount;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class BookingPaidEvent {
        private UUID bookingId;
        private UUID userId;
        private String venueName;
        private LocalDateTime paidAt;
    }

    @Data
    @Builder
    public static class BookingExpiredEvent {
        private UUID bookingId;
        private UUID userId;
        private String venueName;
        private LocalDateTime expiredAt;
    }
}
