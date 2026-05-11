package com.badminton.bookingservice.service;

import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.entity.BookingItem;
import com.badminton.bookingservice.entity.SlotLock;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.repository.SlotLockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final SlotLockRepository slotLockRepository;
    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;

    @Transactional
    public SlotLock lockSlot(UUID userId, UUID venueId, UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        // Check if already locked or booked (simplified for demo)
        if (slotLockRepository.findByCourtIdAndStartTimeAndEndTimeAndStatus(courtId, startTime, endTime, "LOCKED").isPresent()) {
            throw new RuntimeException("Slot already locked");
        }

        SlotLock lock = SlotLock.builder()
                .userId(userId)
                .venueId(venueId)
                .courtId(courtId)
                .startTime(startTime)
                .endTime(endTime)
                .status("LOCKED")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        return slotLockRepository.save(lock);
    }

    @Transactional
    public Booking createBooking(UUID userId, List<UUID> lockIds) {
        List<SlotLock> locks = slotLockRepository.findAllById(lockIds);
        if (locks.isEmpty()) throw new RuntimeException("No valid locks found");

        BigDecimal totalAmount = BigDecimal.valueOf(locks.size() * 100000); // Mock price

        Booking booking = Booking.builder()
                .userId(userId)
                .venueId(locks.get(0).getVenueId())
                .venueNameSnapshot("Badminton Court") // Mock snapshot
                .totalAmount(totalAmount)
                .status("PENDING")
                .paymentStatus("UNPAID")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        List<BookingItem> items = locks.stream().map(lock -> {
            lock.setStatus("CONVERTED_TO_BOOKING");
            return BookingItem.builder()
                    .bookingId(savedBooking.getId())
                    .venueId(lock.getVenueId())
                    .courtId(lock.getCourtId())
                    .courtNameSnapshot("Court " + lock.getCourtId().toString().substring(0, 4))
                    .startTime(lock.getStartTime())
                    .endTime(lock.getEndTime())
                    .priceSnapshot(BigDecimal.valueOf(100000))
                    .status("PENDING")
                    .build();
        }).collect(Collectors.toList());

        bookingItemRepository.saveAll(items);
        slotLockRepository.saveAll(locks);

        return savedBooking;
    }
}
