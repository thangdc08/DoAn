package com.badminton.bookingservice.service;

import com.badminton.bookingservice.client.VenueClient;
import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.entity.BookingItem;
import com.badminton.bookingservice.entity.SlotLock;
import com.badminton.bookingservice.mapper.BookingMapper;
import com.badminton.bookingservice.repository.BookingItemRepository;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.repository.SlotLockRepository;
import com.badminton.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final SlotLockRepository slotLockRepository;
    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final VenueClient venueClient;
    private final BookingMapper bookingMapper;

    @Transactional
    public SlotLock lockSlot(UUID userId, UUID venueId, UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Locking slot for user {} at court {}", userId, courtId);
        
        validateSlotAvailability(courtId, startTime, endTime);

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
    public BookingResponse createBooking(UUID userId, List<UUID> lockIds) {
        log.info("Creating booking for user {} from locks {}", userId, lockIds);
        
        List<SlotLock> locks = getValidLocks(lockIds);
        BigDecimal totalAmount = calculateTotalAmount(locks);
        
        Booking booking = buildBooking(userId, locks, totalAmount);
        Booking savedBooking = bookingRepository.save(booking);

        createBookingItems(savedBooking, locks);
        updateLocksStatus(locks);

        return bookingMapper.toBookingResponse(savedBooking);
    }

    private void validateSlotAvailability(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        if (slotLockRepository.findByCourtIdAndStartTimeAndEndTimeAndStatus(courtId, startTime, endTime, "LOCKED").isPresent()) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "Slot already locked");
        }
    }

    private List<SlotLock> getValidLocks(List<UUID> lockIds) {
        List<SlotLock> locks = slotLockRepository.findAllById(lockIds);
        if (locks.isEmpty()) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "No valid locks found");
        }
        return locks;
    }

    private BigDecimal calculateTotalAmount(List<SlotLock> locks) {
        BigDecimal total = BigDecimal.ZERO;
        for (SlotLock lock : locks) {
            BigDecimal price = venueClient.getPrice(lock.getCourtId(), lock.getStartTime(), lock.getEndTime());
            total = total.add(price);
        }
        return total;
    }

    private Booking buildBooking(UUID userId, List<SlotLock> locks, BigDecimal totalAmount) {
        return Booking.builder()
                .userId(userId)
                .venueId(locks.get(0).getVenueId())
                .venueNameSnapshot("Venue " + locks.get(0).getVenueId().toString().substring(0, 4))
                .totalAmount(totalAmount)
                .status("PENDING")
                .paymentStatus("UNPAID")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
    }

    private void createBookingItems(Booking booking, List<SlotLock> locks) {
        List<BookingItem> items = locks.stream().map(lock -> {
            BigDecimal itemPrice = venueClient.getPrice(lock.getCourtId(), lock.getStartTime(), lock.getEndTime());
            return BookingItem.builder()
                    .bookingId(booking.getId())
                    .venueId(lock.getVenueId())
                    .courtId(lock.getCourtId())
                    .courtNameSnapshot("Court " + lock.getCourtId().toString().substring(0, 4))
                    .startTime(lock.getStartTime())
                    .endTime(lock.getEndTime())
                    .priceSnapshot(itemPrice)
                    .status("PENDING")
                    .build();
        }).collect(Collectors.toList());
        bookingItemRepository.saveAll(items);
    }

    private void updateLocksStatus(List<SlotLock> locks) {
        locks.forEach(lock -> lock.setStatus("CONVERTED_TO_BOOKING"));
        slotLockRepository.saveAll(locks);
    }
}
