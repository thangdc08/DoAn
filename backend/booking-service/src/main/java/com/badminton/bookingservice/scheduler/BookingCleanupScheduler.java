package com.badminton.bookingservice.scheduler;

import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.entity.BookingItem;
import com.badminton.bookingservice.entity.SlotLock;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.repository.SlotLockRepository;
import com.badminton.bookingservice.service.BookingEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupScheduler {

    private final SlotLockRepository slotLockRepository;
    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final BookingEventPublisher eventPublisher;

    @Scheduled(cron = "0 * * * * *") // Run every minute
    @Transactional
    public void cleanupExpiredLocksAndBookings() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Running booking cleanup scheduler at {}", now);

        // 1. Expire SlotLocks
        List<SlotLock> expiredLocks = slotLockRepository.findByStatusAndExpiresAtBefore("LOCKED", now);
        if (!expiredLocks.isEmpty()) {
            log.info("Found {} expired slot locks. Expiring them...", expiredLocks.size());
            expiredLocks.forEach(lock -> lock.setStatus("EXPIRED"));
            slotLockRepository.saveAll(expiredLocks);
        }

        // 2. Expire Bookings (PENDING state that has passed expiresAt)
        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore("PENDING", now);
        if (!expiredBookings.isEmpty()) {
            log.info("Found {} expired pending bookings. Expiring them...", expiredBookings.size());
            for (Booking booking : expiredBookings) {
                booking.setStatus("EXPIRED");
                booking.setPaymentStatus("FAILED");
                bookingRepository.save(booking);

                List<BookingItem> items = bookingItemRepository.findByBookingId(booking.getId());
                items.forEach(item -> item.setStatus("EXPIRED"));
                bookingItemRepository.saveAll(items);

                // Publish BookingExpiredEvent
                eventPublisher.publishBookingExpired(BookingEventPublisher.BookingExpiredEvent.builder()
                        .bookingId(booking.getId())
                        .userId(booking.getUserId())
                        .venueName(booking.getVenueNameSnapshot())
                        .expiredAt(now)
                        .build());
                
                log.info("Booking id {} expired and event published", booking.getId());
            }
        }
    }
}
