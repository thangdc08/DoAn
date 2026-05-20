package com.badminton.bookingservice.repository;

import com.badminton.bookingservice.entity.BookingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

public interface BookingItemRepository extends JpaRepository<BookingItem, UUID> {
    List<BookingItem> findByBookingId(UUID bookingId);
    List<BookingItem> findByCourtIdAndStatusInAndStartTimeGreaterThanEqualAndStartTimeLessThan(
            UUID courtId,
            List<String> statuses,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay);
}
