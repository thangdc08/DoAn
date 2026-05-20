package com.badminton.bookingservice.service;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "booking-events";

    public void publishBookingCreated(BookingCreatedEvent event) {
        kafkaTemplate.send(TOPIC, event.getBookingId().toString(), event);
    }

    public void publishBookingPaid(BookingPaidEvent event) {
        kafkaTemplate.send(TOPIC, event.getBookingId().toString(), event);
    }

    public void publishBookingExpired(BookingExpiredEvent event) {
        kafkaTemplate.send(TOPIC, event.getBookingId().toString(), event);
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
