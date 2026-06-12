package com.badminton.bookingservice.repository;

import com.badminton.bookingservice.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserId(UUID userId);

    Page<Booking> findByUserId(UUID userId, Pageable pageable);

    Page<Booking> findByUserIdAndStatus(UUID userId, String status, Pageable pageable);

    List<Booking> findByStatusAndExpiresAtBefore(String status, LocalDateTime now);

    boolean existsByUserIdAndVenueIdAndStatus(UUID userId, UUID venueId, String status);

    List<Booking> findByStatusAndOwnerReminderSent(String status, Boolean ownerReminderSent);

    List<Booking> findByStatusAndStartTimeBetweenAndPlayerReminderSent(String status, LocalDateTime start, LocalDateTime end, Boolean playerReminderSent);
}
