package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.dto.ActiveSlotLockResponse;
import com.badminton.bookingservice.dto.CreateBookingRequest;
import com.badminton.bookingservice.dto.CreateBookingResponse;
import com.badminton.bookingservice.dto.LockSlotsRequest;
import com.badminton.bookingservice.dto.LockSlotsResponse;
import com.badminton.bookingservice.entity.SlotLock;
import com.badminton.bookingservice.service.BookingService;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.mapper.BookingMapper;
import com.badminton.common.dto.ApiResponse;
import com.badminton.common.exception.AppException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "Endpoints for creating and managing court bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    @PostMapping("/locks")
    @Operation(summary = "Lock booking slots", description = "Locks one or many time slots for checkout")
    public ApiResponse<LockSlotsResponse> lockSlots(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestBody LockSlotsRequest request) {
        log.info("API Request: Lock slots for user {} at court {}", userId, request.getCourtId());

        if (request.getSlots() == null || request.getSlots().isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Slots must not be empty");
        }

        List<SlotLock> locks = request.getSlots().stream()
                .map(slot -> bookingService.lockSlot(
                        userId,
                        request.getVenueId(),
                        request.getCourtId(),
                        slot.getStartTime(),
                        slot.getEndTime()))
                .collect(Collectors.toList());

        return ApiResponse.<LockSlotsResponse>builder()
                .result(LockSlotsResponse.builder()
                        .lockIds(locks.stream().map(SlotLock::getId).collect(Collectors.toList()))
                        .expiresAt(locks.get(0).getExpiresAt())
                        .status("LOCKED")
                        .build())
                .build();
    }

    @PostMapping
    @Operation(summary = "Create booking", description = "Creates booking from locked slot IDs")
    public ApiResponse<CreateBookingResponse> createBooking(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestBody CreateBookingRequest request) {
        log.info("API Request: Create booking for user {} from {} locks", userId, request.getLockIds() == null ? 0 : request.getLockIds().size());

        if (request.getLockIds() == null || request.getLockIds().isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "LockIds must not be empty");
        }

        return ApiResponse.<CreateBookingResponse>builder()
                .result(bookingService.createBookingForCheckout(userId, request.getLockIds()))
                .build();
    }

    @GetMapping("/locks/active")
    @Operation(summary = "Get active slot locks", description = "Returns active temporary locks for a court on a date")
    public ApiResponse<List<ActiveSlotLockResponse>> getActiveLocks(
            @RequestParam UUID courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        List<ActiveSlotLockResponse> locks = bookingService.findActiveLocks(courtId, startOfDay, endOfDay);
        return ApiResponse.<List<ActiveSlotLockResponse>>builder()
                .result(locks)
                .build();
    }

    @GetMapping("/my")
    @Operation(summary = "Get my bookings", description = "Returns a list of bookings for the specified user")
    public ApiResponse<List<BookingResponse>> getMyBookings(@RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: Get my bookings for user {}", userId);
        List<BookingResponse> results = bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper::toBookingResponse)
                .collect(Collectors.toList());
        return ApiResponse.<List<BookingResponse>>builder()
                .result(results)
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Returns booking details by unique ID")
    public ApiResponse<BookingResponse> getBookingById(@PathVariable UUID id) {
        log.info("API Request: Get booking by id {}", id);
        return bookingRepository.findById(id)
                .map(bookingMapper::toBookingResponse)
                .map(res -> ApiResponse.<BookingResponse>builder().result(res).build())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @GetMapping("/internal/has-paid")
    @Operation(summary = "Check if user has paid booking at venue", description = "Internal API for venue-service to verify rating eligibility")
    public boolean hasPaidBooking(
            @RequestParam UUID userId,
            @RequestParam UUID venueId) {
        log.info("Internal Request: Check if user {} has paid booking at venue {}", userId, venueId);
        return bookingRepository.existsByUserIdAndVenueIdAndStatus(userId, venueId, "PAID");
    }
}
