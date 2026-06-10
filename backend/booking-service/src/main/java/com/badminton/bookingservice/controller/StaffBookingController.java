package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.service.BookingService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/staff/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Staff - Booking Management", description = "Staff endpoints for check-in and viewing bookings")
public class StaffBookingController {

  private final BookingService bookingService;

  @GetMapping
  @Operation(summary = "Get staff bookings", description = "Staff gets bookings for venues they manage")
  public ApiResponse<Page<BookingResponse>> getStaffBookings(
      @RequestHeader("X-Auth-User-Id") UUID staffId,
      @RequestParam(required = false) UUID venueId,
      @RequestParam(required = false) String status,
      @PageableDefault(size = 20) Pageable pageable) {
    log.info("API Request: Staff {} getting bookings for venueId={}, status={}", staffId, venueId, status);
    return ApiResponse.<Page<BookingResponse>>builder()
        .result(bookingService.getBookingsForStaff(staffId, venueId, status, pageable))
        .build();
  }

  @PatchMapping("/{bookingId}/checkin")
  @Operation(summary = "Check in a booking", description = "Staff marks a booking as checked in")
  public ApiResponse<BookingResponse> checkIn(
      @RequestHeader("X-Auth-User-Id") UUID staffId,
      @PathVariable UUID bookingId) {
    log.info("API Request: Staff {} checking in booking {}", staffId, bookingId);
    return ApiResponse.<BookingResponse>builder()
        .result(bookingService.checkInBooking(bookingId))
        .build();
  }

  @GetMapping("/today")
  @Operation(summary = "Get today's bookings for staff")
  public ApiResponse<Page<BookingResponse>> getTodayBookings(
      @RequestHeader("X-Auth-User-Id") UUID staffId,
      @RequestParam(required = false) UUID venueId,
      @PageableDefault(size = 50) Pageable pageable) {
    log.info("API Request: Staff {} getting today's bookings", staffId);
    return ApiResponse.<Page<BookingResponse>>builder()
        .result(bookingService.getTodayBookingsForStaff(staffId, venueId, pageable))
        .build();
  }
}
