package com.badminton.bookingservice.service;

import com.badminton.bookingservice.client.VenueClient;
import com.badminton.bookingservice.client.PaymentClient;
import com.badminton.bookingservice.client.SystemConfigClient;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
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
    private final PaymentClient paymentClient;
  private final BookingMapper bookingMapper;
  private final BookingEventPublisher bookingEventPublisher;
  private final StringRedisTemplate redisTemplate;
  private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

  private final SystemConfigClient systemConfigClient;

  @Value("${app.booking.cancel-before-hours:2}")
  private int cancelBeforeHoursDefault;

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

    String lockKey = String.format("lock:court:%s:slot:%s:%s", courtId, startTime.toString(), endTime.toString());
    Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, userId.toString(), java.time.Duration.ofSeconds(60));
    if (acquired == null || !acquired) {
      throw new AppException(HttpStatus.CONFLICT, "Khung giờ này đang được xử lý hoặc giữ chỗ bởi người dùng khác");
    }

    validateSlotAvailability(courtId, startTime, endTime);

    int lockExpireMinutes = systemConfigClient.getInt("auto_expire_minutes", 15);
    SlotLock lock = SlotLock.builder()
        .userId(userId)
        .venueId(venueId)
        .courtId(courtId)
        .startTime(startTime)
        .endTime(endTime)
        .status("LOCKED")
        .expiresAt(LocalDateTime.now().plusMinutes(lockExpireMinutes))
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
    List<SlotLock> locks = slotLockRepository.findAllById(lockIds);
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

    releaseSlotLocks(userId, locks);

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
    int expireMinutes = systemConfigClient.getInt("auto_expire_minutes", 15);
    VenueInternalResponse venue = venueClient.getVenueById(locks.get(0).getVenueId());
    return Booking.builder()
        .userId(userId)
        .venueId(locks.get(0).getVenueId())
        .venueNameSnapshot(venue != null && venue.getName() != null ? venue.getName() : "Unknown venue")
        .totalAmount(totalAmount)
        .totalAmountVnd(totalAmount)
        .status("PENDING")
        .paymentStatus("UNPAID")
        .expiresAt(LocalDateTime.now().plusMinutes(expireMinutes))
        .build();
  }

  private void createBookingItems(Booking booking, List<SlotLock> locks) {
    String venueName = (booking.getVenueNameSnapshot() == null || booking.getVenueNameSnapshot().isBlank())
        ? "Unknown venue"
        : booking.getVenueNameSnapshot();

    List<BookingItem> items = locks.stream().map(lock -> {
      BigDecimal itemPrice = venueClient.getPrice(lock.getCourtId(), lock.getStartTime(), lock.getEndTime());
      if (itemPrice == null) {
        log.error("Price lookup returned null for booking item court {} (lock={})", lock.getCourtId(), lock.getId());
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể tính giá cho khung giờ, vui lòng thử lại");
      }
      return BookingItem.builder()
          .bookingId(booking.getId())
          .venueId(lock.getVenueId())
          .venueNameSnapshot(venueName)
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

  private void releaseSlotLocks(UUID userId, List<SlotLock> locks) {
    if (locks == null) return;
    for (SlotLock lock : locks) {
      try {
        String lockKey = String.format("lock:court:%s:slot:%s:%s", lock.getCourtId(), lock.getStartTime().toString(), lock.getEndTime().toString());
        redisTemplate.delete(lockKey);
        log.info("Released Redis lock key: {}", lockKey);
      } catch (Exception e) {
        log.error("Failed to release Redis lock for lock {}", lock.getId(), e);
      }
    }
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

        // If booking was already paid, trigger refund before cancelling
        if ("PAID".equals(booking.getStatus()) || "SUCCESS".equals(booking.getPaymentStatus())) {
            log.info("Booking {} was paid (paymentStatus={}), triggering refund", bookingId, booking.getPaymentStatus());
            try {
                paymentClient.refundPayment(bookingId);
                log.info("Refund initiated successfully for booking {}", bookingId);
            } catch (Exception e) {
                log.error("Refund failed for booking {}: {}", bookingId, e.getMessage());
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không thể hoàn tiền: " + e.getMessage());
            }
        }

        booking.setStatus("CANCELLED_BY_ADMIN");

        // Update booking items
        List<BookingItem> items = bookingItemRepository.findByBookingId(bookingId);
        items.forEach(item -> item.setStatus("CANCELLED"));
        bookingItemRepository.saveAll(items);

        Booking savedBooking = bookingRepository.save(booking);

        // Publish BookingCancelledByAdmin event via outbox
        BookingEventPublisher.BookingCancelledByAdminEvent cancelEvent =
                BookingEventPublisher.BookingCancelledByAdminEvent.builder()
                        .bookingId(bookingId)
                        .userId(booking.getUserId())
                        .adminId(adminId)
                        .reason(reason)
                        .cancelledAt(java.time.LocalDateTime.now())
                        .build();
        bookingEventPublisher.publishBookingCancelledByAdmin(cancelEvent);

        log.info("Booking {} cancelled by admin {}", bookingId, adminId);
        return bookingMapper.toBookingResponse(savedBooking);
    }


  @Transactional
  public BookingResponse cancelBookingByUser(UUID bookingId, UUID userId) {
    log.info("User {} cancelling booking {}", userId, bookingId);

    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt sân"));

    if (!booking.getUserId().equals(userId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền hủy đơn đặt sân này");
    }

    if ("CANCELLED_BY_USER".equals(booking.getStatus()) || "CANCELLED_BY_ADMIN".equals(booking.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Đơn đặt sân đã được hủy trước đó");
    }

    if ("EXPIRED".equals(booking.getStatus()) || "FAILED".equals(booking.getStatus())) {
      throw new AppException(HttpStatus.CONFLICT, "Không thể hủy đơn đặt sân đã hết hạn hoặc thất bại");
    }

    // Retrieve booking items to check starting times
    List<BookingItem> items = bookingItemRepository.findByBookingId(bookingId);
    if (items.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Đơn đặt sân không chứa thông tin khung giờ");
    }

    // Find the earliest starting time among all slots booked
    LocalDateTime earliestStart = items.stream()
        .map(BookingItem::getStartTime)
        .min(LocalDateTime::compareTo)
        .orElseThrow();

    // Read cancellation window from system config, fall back to venue policy, then to property
    int cancelHours = systemConfigClient.getInt("cancellation_window_hours", cancelBeforeHoursDefault);
    try {
      VenueInternalResponse venue = venueClient.getVenueById(booking.getVenueId());
      if (venue != null && venue.getPolicy() != null && !venue.getPolicy().isEmpty()) {
        com.fasterxml.jackson.databind.JsonNode rootNode = objectMapper.readTree(venue.getPolicy());
        com.fasterxml.jackson.databind.JsonNode bookingPolicy = rootNode.get("bookingPolicy");
        if (bookingPolicy != null && bookingPolicy.has("cancelWindow")) {
          cancelHours = bookingPolicy.get("cancelWindow").asInt();
          log.info("Using dynamic cancellation window from venue policy: {} hours", cancelHours);
        }
      }
    } catch (Exception e) {
      log.warn("Failed to parse venue operating policy for cancel window, using default: {}", e.getMessage());
    }

    if (earliestStart.isBefore(LocalDateTime.now().plusHours(cancelHours))) {
      throw new AppException(HttpStatus.BAD_REQUEST, 
          String.format("Không thể hủy đặt sân trước giờ bắt đầu dưới %d giờ", cancelHours));
    }

     // If booking was already paid, trigger refund before cancelling
    if ("PAID".equals(booking.getStatus()) || "SUCCESS".equals(booking.getPaymentStatus())) {
    log.info("Booking {} was paid, triggering refund on user cancel", bookingId);
    try {
      paymentClient.refundPayment(bookingId);
      log.info("Refund initiated for booking {} by user {}", bookingId, userId);
    } catch (Exception e) {
      log.error("Refund failed for booking {}: {}", bookingId, e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR,
          "Không thể hoàn tiền: " + e.getMessage());
    }
    }

    booking.setStatus("CANCELLED_BY_USER");

    // Cancel all booking items to release court slots
    items.forEach(item -> item.setStatus("CANCELLED"));
    bookingItemRepository.saveAll(items);

    Booking savedBooking = bookingRepository.save(booking);

    log.info("Booking {} cancelled by user {}", bookingId, userId);
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
    int failedBookings = (int) bookings.stream().filter(b -> !"PAID".equals(b.getStatus()) && !"PENDING".equals(b.getStatus())).count();

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

    // Daily breakdown
    java.util.Map<String, List<Booking>> bookingsByDate = bookings.stream()
        .collect(Collectors.groupingBy(b -> b.getCreatedAt().toLocalDate().toString()));

    List<com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue> dailyBreakdown = bookingsByDate.entrySet()
        .stream()
        .map(entry -> {
          String dateStr = entry.getKey();
          List<Booking> dateBookings = entry.getValue();

          BigDecimal dateRevenue = dateBookings.stream()
              .filter(b -> "PAID".equals(b.getStatus()))
              .map(Booking::getTotalAmount)
              .reduce(BigDecimal.ZERO, BigDecimal::add);

          return com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue.builder()
              .date(dateStr)
              .revenue(dateRevenue)
              .bookingCount(dateBookings.size())
              .build();
        })
        .sorted(java.util.Comparator.comparing(com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue::getDate))
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
        .dailyBreakdown(dailyBreakdown)
        .build();
  }

  public com.badminton.bookingservice.dto.RevenueStatsResponse getAdminRevenueStats(
      UUID venueId, java.time.LocalDate fromDate, java.time.LocalDate toDate) {
    log.info("Admin getting revenue stats for venueId={}, from={}, to={}", venueId, fromDate, toDate);

    List<Booking> bookings = bookingRepository.findAll();

    if (venueId != null) {
      bookings = bookings.stream()
          .filter(b -> b.getVenueId().equals(venueId))
          .collect(Collectors.toList());
    }

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

    BigDecimal totalRevenue = bookings.stream()
        .filter(b -> "PAID".equals(b.getStatus()))
        .map(Booking::getTotalAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    int totalBookings = bookings.size();
    int paidBookings = (int) bookings.stream().filter(b -> "PAID".equals(b.getStatus())).count();
    int pendingBookings = (int) bookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
    int failedBookings = (int) bookings.stream().filter(b -> !"PAID".equals(b.getStatus()) && !"PENDING".equals(b.getStatus())).count();

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

    // Daily breakdown
    java.util.Map<String, List<Booking>> bookingsByDate = bookings.stream()
        .collect(Collectors.groupingBy(b -> b.getCreatedAt().toLocalDate().toString()));

    List<com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue> dailyBreakdown = bookingsByDate.entrySet()
        .stream()
        .map(entry -> {
          String dateStr = entry.getKey();
          List<Booking> dateBookings = entry.getValue();

          BigDecimal dateRevenue = dateBookings.stream()
              .filter(b -> "PAID".equals(b.getStatus()))
              .map(Booking::getTotalAmount)
              .reduce(BigDecimal.ZERO, BigDecimal::add);

          return com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue.builder()
              .date(dateStr)
              .revenue(dateRevenue)
              .bookingCount(dateBookings.size())
              .build();
        })
        .sorted(java.util.Comparator.comparing(com.badminton.bookingservice.dto.RevenueStatsResponse.DailyRevenue::getDate))
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
        .dailyBreakdown(dailyBreakdown)
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

  private String getVietnameseDayKey(java.time.DayOfWeek dayOfWeek) {
    switch (dayOfWeek) {
      case MONDAY: return "Thứ 2";
      case TUESDAY: return "Thứ 3";
      case WEDNESDAY: return "Thứ 4";
      case THURSDAY: return "Thứ 5";
      case FRIDAY: return "Thứ 6";
      case SATURDAY: return "Thứ 7";
      case SUNDAY: return "Chủ Nhật";
      default: return "";
    }
  }

  public List<com.badminton.bookingservice.dto.ConflictBookingInfo> checkBusinessHoursConflicts(UUID venueId, String policyJson) {
    if (policyJson == null || policyJson.trim().isEmpty()) {
      return List.of();
    }
    try {
      com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      com.fasterxml.jackson.databind.JsonNode rootNode = mapper.readTree(policyJson);
      com.fasterxml.jackson.databind.JsonNode bhNode = rootNode.get("businessHours");
      if (bhNode == null) {
        return List.of();
      }

      LocalDateTime now = LocalDateTime.now();
      List<com.badminton.bookingservice.entity.BookingItem> items = bookingItemRepository.findByVenueIdAndStatusAndStartTimeGreaterThanEqual(venueId, "PAID", now);
      List<com.badminton.bookingservice.dto.ConflictBookingInfo> conflicts = new java.util.ArrayList<>();

      for (com.badminton.bookingservice.entity.BookingItem item : items) {
        java.time.DayOfWeek dayOfWeek = item.getStartTime().getDayOfWeek();
        String dayKey = getVietnameseDayKey(dayOfWeek);
        if (dayKey.isEmpty()) continue;

        com.fasterxml.jackson.databind.JsonNode dayNode = bhNode.get(dayKey);
        if (dayNode != null) {
          boolean isOpen = dayNode.path("isOpen").asBoolean(true);
          if (!isOpen) {
            conflicts.add(com.badminton.bookingservice.dto.ConflictBookingInfo.builder()
                .bookingId(item.getBookingId())
                .courtName(item.getCourtNameSnapshot())
                .startTime(item.getStartTime().toString())
                .endTime(item.getEndTime().toString())
                .build());
            continue;
          }

          String openStr = dayNode.path("open").asText("05:00");
          String closeStr = dayNode.path("close").asText("22:00");

          java.time.LocalTime openTime = java.time.LocalTime.parse(openStr);
          java.time.LocalTime closeTime = java.time.LocalTime.parse(closeStr);

          java.time.LocalTime startTime = item.getStartTime().toLocalTime();
          java.time.LocalTime endTime = item.getEndTime().toLocalTime();

          if (startTime.isBefore(openTime) || endTime.isAfter(closeTime)) {
            conflicts.add(com.badminton.bookingservice.dto.ConflictBookingInfo.builder()
                .bookingId(item.getBookingId())
                .courtName(item.getCourtNameSnapshot())
                .startTime(item.getStartTime().toString())
                .endTime(item.getEndTime().toString())
                .build());
          }
        }
      }
      return conflicts;
    } catch (Exception e) {
      log.error("Error checking business hours conflicts: {}", e.getMessage(), e);
    }
    return List.of();
  }
}
