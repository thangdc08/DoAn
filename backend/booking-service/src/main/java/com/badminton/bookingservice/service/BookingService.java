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
import org.springframework.data.domain.PageImpl;
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

    List<SlotLock> locks = getValidLocks(userId, lockIds);
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

    UUID ownerId = (venue != null) ? venue.getOwnerId() : null;
    bookingEventPublisher.publishBookingCreated(BookingEventPublisher.BookingCreatedEvent.builder()
        .bookingId(booking.getId())
        .userId(booking.getUserId())
        .ownerId(ownerId)
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
    if (slotLockRepository.findByCourtIdAndStartTimeAndEndTimeAndStatus(courtId, startTime, endTime, "LOCKED")
        .isPresent()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Slot already locked");
    }
  }

  private List<SlotLock> getValidLocks(UUID userId, List<UUID> lockIds) {
    List<SlotLock> locks = slotLockRepository.findAllById(lockIds);
    if (locks.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "No valid locks found");
    }

    if (locks.size() != lockIds.size()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Some lockIds are invalid or do not exist");
    }

    final var now = LocalDateTime.now();
    for (SlotLock lock : locks) {
      if (!"LOCKED".equals(lock.getStatus())) {
        throw new AppException(HttpStatus.BAD_REQUEST, "Lock " + lock.getId() + " is not in LOCKED state");
      }
      if (lock.getExpiresAt() == null || lock.getExpiresAt().isBefore(now)) {
        throw new AppException(HttpStatus.BAD_REQUEST, "Lock " + lock.getId() + " has expired");
      }
      if (!userId.equals(lock.getUserId())) {
        throw new AppException(HttpStatus.FORBIDDEN, "Lock " + lock.getId() + " does not belong to user");
      }
    }

    return locks;
  }

  private BigDecimal calculateTotalAmount(List<SlotLock> locks) {
    BigDecimal total = BigDecimal.ZERO;
    for (SlotLock lock : locks) {
      BigDecimal price = venueClient.getPrice(lock.getCourtId(), lock.getStartTime(), lock.getEndTime());
      if (price == null) {
        log.error("Price lookup returned null for court {} (lock={})", lock.getCourtId(), lock.getId());
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tính giá cho khung giờ, vui lòng thử lại");
      }
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
        .totalAmountVnd(totalAmount)
        .status("PENDING")
        .paymentStatus("UNPAID")
        .expiresAt(LocalDateTime.now().plusMinutes(15))
        .build();
  }

  private void createBookingItems(Booking booking, List<SlotLock> locks) {
    List<BookingItem> items = locks.stream().map(lock -> {
      BigDecimal itemPrice = venueClient.getPrice(lock.getCourtId(), lock.getStartTime(), lock.getEndTime());
      if (itemPrice == null) {
        log.error("Price lookup returned null for booking item court {} (lock={})", lock.getCourtId(), lock.getId());
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tính giá cho khung giờ, vui lòng thử lại");
      }
      return BookingItem.builder()
          .bookingId(booking.getId())
          .venueId(lock.getVenueId())
          .courtId(lock.getCourtId())
          .courtNameSnapshot("Court " + lock.getCourtId().toString().substring(0, 8))
          .startTime(lock.getStartTime())
          .endTime(lock.getEndTime())
          .priceSnapshot(itemPrice)
          .priceSnapshotVnd(itemPrice)
          .status("PENDING")
          .build();
    }).collect(Collectors.toList());
    bookingItemRepository.saveAll(items);
  }

  private void updateLocksStatus(List<SlotLock> locks) {
    locks.forEach(lock -> lock.setStatus("CONVERTED_TO_BOOKING"));
    slotLockRepository.saveAll(locks);
  }

  // Admin methods
  public org.springframework.data.domain.Page<BookingResponse> getAllBookingsForAdmin(
      String status, UUID venueId, UUID userId, org.springframework.data.domain.Pageable pageable) {
    log.info("Admin getting all bookings with status={}, venueId={}, userId={}", status, venueId, userId);

    List<Booking> bookings = bookingRepository.findAll();

    // Filter by status
    if (status != null && !status.isEmpty()) {
      bookings = bookings.stream()
          .filter(b -> b.getStatus().equals(status))
          .collect(Collectors.toList());
    }

    // Filter by venueId
    if (venueId != null) {
      bookings = bookings.stream()
          .filter(b -> b.getVenueId().equals(venueId))
          .collect(Collectors.toList());
    }

    // Filter by userId
    if (userId != null) {
      bookings = bookings.stream()
          .filter(b -> b.getUserId().equals(userId))
          .collect(Collectors.toList());
    }

    // Manual pagination
    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), bookings.size());
    List<BookingResponse> pageContent = bookings.subList(start, end).stream()
        .map(bookingMapper::toBookingResponse)
        .collect(Collectors.toList());

    return new PageImpl<>(pageContent, pageable, bookings.size());
  }

  @Transactional
  public BookingResponse cancelBookingByAdmin(UUID bookingId, UUID adminId, String reason) {
    log.info("Admin {} cancelling booking {} with reason: {}", adminId, bookingId, reason);

    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Booking not found"));

    if ("CANCELLED_BY_ADMIN".equals(booking.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Booking is already cancelled");
    }

    booking.setStatus("CANCELLED_BY_ADMIN");

    // Update booking items
    List<BookingItem> items = bookingItemRepository.findByBookingId(bookingId);
    items.forEach(item -> item.setStatus("CANCELLED"));
    bookingItemRepository.saveAll(items);

    Booking savedBooking = bookingRepository.save(booking);

    // TODO: Refund payment if already paid
    // TODO: Publish BookingCancelledByAdmin event

    log.info("Booking {} cancelled by admin {}", bookingId, adminId);
    return bookingMapper.toBookingResponse(savedBooking);
  }

  // Owner methods
  public org.springframework.data.domain.Page<BookingResponse> getBookingsForOwner(
      UUID ownerId, UUID venueId, String status, org.springframework.data.domain.Pageable pageable) {
    log.info("Owner {} getting bookings for venueId={}, status={}", ownerId, venueId, status);

    // Get all venues owned by this owner
    List<UUID> ownerVenueIds = getVenueIdsByOwnerId(ownerId);

    if (ownerVenueIds.isEmpty()) {
      return org.springframework.data.domain.Page.empty(pageable);
    }

    List<Booking> bookings = bookingRepository.findAll().stream()
        .filter(b -> ownerVenueIds.contains(b.getVenueId()))
        .collect(Collectors.toList());

    // Filter by specific venueId if provided
    if (venueId != null) {
      if (!ownerVenueIds.contains(venueId)) {
        throw new AppException(HttpStatus.FORBIDDEN, "You don't own this venue");
      }
      bookings = bookings.stream()
          .filter(b -> b.getVenueId().equals(venueId))
          .collect(Collectors.toList());
    }

    // Filter by status
    if (status != null && !status.isEmpty()) {
      bookings = bookings.stream()
          .filter(b -> b.getStatus().equals(status))
          .collect(Collectors.toList());
    }

    // Manual pagination
    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), bookings.size());
    List<BookingResponse> pageContent = bookings.subList(start, end).stream()
        .map(bookingMapper::toBookingResponse)
        .collect(Collectors.toList());

    return new org.springframework.data.domain.PageImpl<>(pageContent, pageable, bookings.size());
  }

  public com.badminton.bookingservice.dto.RevenueStatsResponse getRevenueStats(
      UUID ownerId, UUID venueId, java.time.LocalDate fromDate, java.time.LocalDate toDate) {
    log.info("Owner {} getting revenue stats for venueId={}, from={}, to={}",
        ownerId, venueId, fromDate, toDate);

    // Get all venues owned by this owner
    List<UUID> ownerVenueIds = getVenueIdsByOwnerId(ownerId);

    if (ownerVenueIds.isEmpty()) {
      return com.badminton.bookingservice.dto.RevenueStatsResponse.builder()
          .totalRevenue(BigDecimal.ZERO)
          .totalBookings(0)
          .paidBookings(0)
          .pendingBookings(0)
          .failedBookings(0)
          .fromDate(fromDate)
          .toDate(toDate)
          .venueBreakdown(List.of())
          .build();
    }

    // Filter bookings
    List<Booking> bookings = bookingRepository.findAll().stream()
        .filter(b -> ownerVenueIds.contains(b.getVenueId()))
        .collect(Collectors.toList());

    // Filter by specific venueId if provided
    if (venueId != null) {
      if (!ownerVenueIds.contains(venueId)) {
        throw new AppException(HttpStatus.FORBIDDEN, "You don't own this venue");
      }
      bookings = bookings.stream()
          .filter(b -> b.getVenueId().equals(venueId))
          .collect(Collectors.toList());
    }

    // Filter by date range
    if (fromDate != null) {
      LocalDateTime fromDateTime = fromDate.atStartOfDay();
      bookings = bookings.stream()
          .filter(b -> b.getCreatedAt().isAfter(fromDateTime) ||
              b.getCreatedAt().isEqual(fromDateTime))
          .collect(Collectors.toList());
    }

    if (toDate != null) {
      LocalDateTime toDateTime = toDate.atTime(23, 59, 59);
      bookings = bookings.stream()
          .filter(b -> b.getCreatedAt().isBefore(toDateTime) ||
              b.getCreatedAt().isEqual(toDateTime))
          .collect(Collectors.toList());
    }

    // Calculate statistics
    BigDecimal totalRevenue = bookings.stream()
        .filter(b -> "PAID".equals(b.getStatus()))
        .map(Booking::getTotalAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    int totalBookings = bookings.size();
    int paidBookings = (int) bookings.stream().filter(b -> "PAID".equals(b.getStatus())).count();
    int pendingBookings = (int) bookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
    int failedBookings = (int) bookings.stream().filter(b -> "FAILED".equals(b.getStatus())).count();

    // Venue breakdown
    java.util.Map<UUID, List<Booking>> bookingsByVenue = bookings.stream()
        .collect(Collectors.groupingBy(Booking::getVenueId));

    List<com.badminton.bookingservice.dto.RevenueStatsResponse.VenueRevenue> venueBreakdown = bookingsByVenue.entrySet()
        .stream()
        .map(entry -> {
          UUID vId = entry.getKey();
          List<Booking> venueBookings = entry.getValue();

          BigDecimal venueRevenue = venueBookings.stream()
              .filter(b -> "PAID".equals(b.getStatus()))
              .map(Booking::getTotalAmount)
              .reduce(BigDecimal.ZERO, BigDecimal::add);

          String venueName = venueBookings.isEmpty() ? "Unknown" : venueBookings.get(0).getVenueNameSnapshot();

          return com.badminton.bookingservice.dto.RevenueStatsResponse.VenueRevenue.builder()
              .venueId(vId)
              .venueName(venueName)
              .revenue(venueRevenue)
              .bookingCount(venueBookings.size())
              .build();
        })
        .collect(Collectors.toList());

    return com.badminton.bookingservice.dto.RevenueStatsResponse.builder()
        .totalRevenue(totalRevenue)
        .totalBookings(totalBookings)
        .paidBookings(paidBookings)
        .pendingBookings(pendingBookings)
        .failedBookings(failedBookings)
        .fromDate(fromDate)
        .toDate(toDate)
        .venueBreakdown(venueBreakdown)
        .build();
  }

  private List<UUID> getVenueIdsByOwnerId(UUID ownerId) {
    try {
      // Call venue service to get owner's venues
      com.badminton.common.dto.ApiResponse<List<VenueInternalResponse>> resp = venueClient.getVenuesByOwner(ownerId);
      if (resp != null && resp.getResult() != null) {
        return resp.getResult().stream()
            .map(VenueInternalResponse::getId)
            .collect(Collectors.toList());
      }
    } catch (Exception e) {
      log.error("Failed to get venues for owner {}", ownerId, e);
    }
    return List.of();
  }
}
