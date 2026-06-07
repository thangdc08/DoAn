package com.badminton.bookingservice.consumer;

import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.entity.BookingItem;
import com.badminton.bookingservice.event.PaymentFailedEvent;
import com.badminton.bookingservice.event.PaymentRefundedEvent;
import com.badminton.bookingservice.event.PaymentSucceededEvent;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.service.BookingEventPublisher;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final BookingEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;

    // ──────────────────────────────────────────────
    // Generic listener: accepts any payment event as JSON,
    // dispatches to the correct handler based on eventType
    // ──────────────────────────────────────────────
    @KafkaListener(topics = "payment-events", groupId = "booking-group",
            containerFactory = "jsonNodeKafkaListenerContainerFactory")
    @Transactional
    public void consumePaymentEvent(JsonNode eventNode) {
        String eventType = eventNode.has("eventType") ? eventNode.get("eventType").asText() : null;
        if (eventType == null) {
            log.warn("Received payment event without eventType, ignoring");
            return;
        }

        log.info("Received payment event type={}", eventType);

        switch (eventType) {
            case "PaymentSucceeded" -> consumePaymentSucceeded(eventNode);
            case "PaymentFailed"    -> consumePaymentFailed(eventNode);
            case "PaymentRefunded"  -> consumePaymentRefunded(eventNode);
            default                -> log.warn("Unknown payment event type: {}", eventType);
        }
    }

    // ──────────────────────────────────────────────
    // PaymentSucceeded: mark booking PAID
    // ──────────────────────────────────────────────
    private void consumePaymentSucceeded(JsonNode node) {
        try {
            PaymentSucceededEvent event = objectMapper.treeToValue(node, PaymentSucceededEvent.class);
            log.info("Processing PaymentSucceeded for booking id: {}", event.getBookingId());

            Booking booking = bookingRepository.findById(event.getBookingId()).orElseThrow();
            booking.setStatus("PAID");
            booking.setPaymentStatus("SUCCESS");
            booking.setPaidAt(event.getPaidAt());
            bookingRepository.save(booking);

            List<BookingItem> items = bookingItemRepository.findByBookingId(booking.getId());
            items.forEach(item -> item.setStatus("BOOKED"));
            bookingItemRepository.saveAll(items);

            eventPublisher.publishBookingPaid(BookingEventPublisher.BookingPaidEvent.builder()
                    .bookingId(booking.getId())
                    .userId(booking.getUserId())
                    .venueName(booking.getVenueNameSnapshot())
                    .paidAt(booking.getPaidAt())
                    .build());

            log.info("Booking {} marked as PAID", booking.getId());
        } catch (Exception e) {
            log.error("Failed to process PaymentSucceeded event", e);
        }
    }

    // ──────────────────────────────────────────────
    // PaymentFailed: mark booking EXPIRED/FAILED immediately
    // ──────────────────────────────────────────────
    private void consumePaymentFailed(JsonNode node) {
        try {
            PaymentFailedEvent event = objectMapper.treeToValue(node, PaymentFailedEvent.class);
            log.info("Processing PaymentFailed for booking id: {}, reason: {}",
                    event.getBookingId(), event.getFailureReason());

            Booking booking = bookingRepository.findById(event.getBookingId()).orElse(null);
            if (booking == null) {
                log.warn("Booking {} not found for PaymentFailed event", event.getBookingId());
                return;
            }

            // Only update if still PENDING — avoid overriding manual cancellation
            if ("PENDING".equals(booking.getStatus())) {
                booking.setStatus("EXPIRED");
                booking.setPaymentStatus("FAILED");
                bookingRepository.save(booking);
                log.info("Booking {} marked as EXPIRED due to payment failure", booking.getId());
            } else {
                log.info("Booking {} status={}, skipping FAILED update (already handled)",
                        booking.getId(), booking.getStatus());
            }
        } catch (Exception e) {
            log.error("Failed to process PaymentFailed event", e);
        }
    }

    // ──────────────────────────────────────────────
    // PaymentRefunded: mark booking as refunded
    // ──────────────────────────────────────────────
    private void consumePaymentRefunded(JsonNode node) {
        try {
            PaymentRefundedEvent event = objectMapper.treeToValue(node, PaymentRefundedEvent.class);
            log.info("Processing PaymentRefunded for booking id: {}, tx={}",
                    event.getBookingId(), event.getTransactionId());

            Booking booking = bookingRepository.findById(event.getBookingId()).orElse(null);
            if (booking == null) {
                log.warn("Booking {} not found for PaymentRefunded event", event.getBookingId());
                return;
            }

            // Mark booking items as cancelled (slot released)
            List<BookingItem> items = bookingItemRepository.findByBookingId(booking.getId());
            items.forEach(item -> item.setStatus("CANCELLED"));
            bookingItemRepository.saveAll(items);

            // Update booking status if it was still PAID
            if ("PAID".equals(booking.getStatus())) {
                booking.setStatus("REFUNDED");
                bookingRepository.save(booking);
                log.info("Booking {} marked as REFUNDED", booking.getId());
            }
        } catch (Exception e) {
            log.error("Failed to process PaymentRefunded event", e);
        }
    }
}
