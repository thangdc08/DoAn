package com.badminton.bookingservice.consumer;

import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.entity.BookingItem;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
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
    private final com.badminton.bookingservice.service.BookingEventPublisher eventPublisher;

    @KafkaListener(topics = "payment-events", groupId = "booking-group")
    @Transactional
    public void consumePaymentSucceeded(com.badminton.bookingservice.event.PaymentSucceededEvent event) {
        log.info("Received payment succeeded event for booking id: {}", event.getBookingId());
        
        Booking booking = bookingRepository.findById(event.getBookingId()).orElseThrow();
        booking.setStatus("PAID");
        booking.setPaymentStatus("SUCCESS");
        booking.setPaidAt(event.getPaidAt());
        bookingRepository.save(booking);

        List<BookingItem> items = bookingItemRepository.findByBookingId(booking.getId());
        items.forEach(item -> item.setStatus("BOOKED"));
        bookingItemRepository.saveAll(items);

        eventPublisher.publishBookingPaid(com.badminton.bookingservice.service.BookingEventPublisher.BookingPaidEvent.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .venueName(booking.getVenueNameSnapshot())
                .paidAt(booking.getPaidAt())
                .build());

        log.info("Booking id {} marked as PAID and event published", booking.getId());
    }
}
