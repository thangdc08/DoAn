package com.badminton.bookingservice.service;

import com.badminton.bookingservice.client.VenueClient;
import com.badminton.bookingservice.dto.ActiveSlotLockResponse;
import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.dto.CreateBookingResponse;
import com.badminton.bookingservice.dto.VenueInternalResponse;
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
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
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
    private final BookingEventPublisher bookingEventPublisher;

    public List<ActiveSlotLockResponse> findActiveLocks(UUID courtId, LocalDateTime startOfDay, LocalDateTime endOfDay) {
        List<ActiveSlotLockResponse> activeLocks = slotLockRepository
                .findByCourtIdAndStatusAndExpiresAtAfterAndStartTimeGreaterThanEqualAndStartTimeLessThan(
                        courtId,
                        "LOCKED",
                        LocalDateTime.now(),
                        startOfDay,
                        endOfDay)
                .stream()
                .map(lock -> ActiveSlotLockResponse.builder()
                        .id(lock.getId())
                        .courtId(lock.getCourtId())
                        .startTime(lock.getStartTime())
                        .endTime(lock.getEndTime())
                        .expiresAt(lock.getExpiresAt())
                        .status("LOCKED")
                        .build())
                .collect(Collectors.toList());

        List<ActiveSlotLockResponse> bookedOrPendingItems = bookingItemRepository
                .findByCourtIdAndStatusInAndStartTimeGreaterThanEqualAndStartTimeLessThan(
                        courtId,
                        List.of("PENDING", "BOOKED"),
                        startOfDay,
                        endOfDay)
                .stream()
                .map(item -> ActiveSlotLockResponse.builder()
                        .id(item.getId())
                        .courtId(item.getCourtId())
                        .startTime(item.getStartTime())
                        .endTime(item.getEndTime())
                        .status("BOOKED".equals(item.getStatus()) ? "BOOKED" : "LOCKED")
                        .build())
                .collect(Collectors.toList());

        activeLocks.addAll(bookedOrPendingItems);
        return activeLocks;
    }

    @Transactional
    public SlotLock lockSlot(UUID userId, UUID venueId, UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        log.info("Locking slot for user {} at court {}", userId, courtId);
        if (startTime == null || endTime == null || !endTime.isAfter(startTime)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Thời gian slot không hợp lệ");
        }

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

        try {
            return slotLockRepository.save(lock);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Cannot lock slot due to data integrity: court={}, start={}, end={}", courtId, startTime, endTime, ex);
            throw new AppException(HttpStatus.CONFLICT, "Khung giờ đã được giữ chỗ hoặc đã đặt");
        } catch (DataAccessException ex) {
            log.error("Database error while locking slot: court={}, start={}, end={}", courtId, startTime, endTime, ex);
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể giữ chỗ lúc này, vui lòng thử lại");
        }
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

    @Transactional
    public CreateBookingResponse createBookingForCheckout(UUID userId, List<UUID> lockIds) {
        BookingResponse booking = createBooking(userId, lockIds);
        List<BookingItem> items = bookingItemRepository.findByBookingId(booking.getId());
        VenueInternalResponse venue = venueClient.getVenueById(booking.getVenueId());

        bookingEventPublisher.publishBookingCreated(BookingEventPublisher.BookingCreatedEvent.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .ownerId(venue.getOwnerId())
                .venueName(booking.getVenueNameSnapshot())
                .totalAmount(booking.getTotalAmount())
                .createdAt(booking.getCreatedAt())
                .build());

        return CreateBookingResponse.builder()
                .bookingId(booking.getId())
                .status(booking.getStatus())
                .paymentStatus(booking.getPaymentStatus())
                .totalAmount(booking.getTotalAmount())
                .expiresAt(booking.getExpiresAt())
                .venueNameSnapshot(booking.getVenueNameSnapshot())
                .items(items.stream().map(item -> CreateBookingResponse.Item.builder()
                        .id(item.getId())
                        .courtNameSnapshot(item.getCourtNameSnapshot())
                        .startTime(item.getStartTime())
                        .endTime(item.getEndTime())
                        .priceSnapshot(item.getPriceSnapshot())
                        .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private void validateSlotAvailability(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        if (slotLockRepository.findByCourtIdAndStartTimeAndEndTimeAndStatus(courtId, startTime, endTime, "LOCKED").isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Slot already locked");
        }
    }

    private List<SlotLock> getValidLocks(List<UUID> lockIds) {
        List<SlotLock> locks = slotLockRepository.findAllById(lockIds);
        if (locks.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "No valid locks found");
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
        VenueInternalResponse venue = venueClient.getVenueById(locks.get(0).getVenueId());
        return Booking.builder()
                .userId(userId)
                .venueId(locks.get(0).getVenueId())
                .venueNameSnapshot(venue != null && venue.getName() != null ? venue.getName() : "Unknown venue")
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
                    .courtNameSnapshot("Court " + lock.getCourtId().toString().substring(0, 8))
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
