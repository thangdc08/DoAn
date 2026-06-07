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

import com.badminton.bookingservice.dto.RevenueStatsResponse;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin - Booking Management", description = "Admin endpoints for booking management")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get all bookings", description = "Admin gets all bookings with filters")
    public ApiResponse<Page<BookingResponse>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID venueId,
            @RequestParam(required = false) UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("API Request: Admin get all bookings with status={}, venueId={}, userId={}", status, venueId, userId);
        return ApiResponse.<Page<BookingResponse>>builder()
                .result(bookingService.getAllBookingsForAdmin(status, venueId, userId, pageable))
                .build();
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get system-wide revenue statistics", description = "Admin gets revenue statistics across all venues")
    public ApiResponse<RevenueStatsResponse> getSystemRevenue(
            @RequestParam(required = false) UUID venueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        log.info("API Request: Admin getting system revenue stats for venueId={}, from={}, to={}", venueId, fromDate, toDate);
        return ApiResponse.<RevenueStatsResponse>builder()
                .result(bookingService.getAdminRevenueStats(venueId, fromDate, toDate))
                .build();
    }

    @PatchMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel booking", description = "Admin cancels a booking")
    public ApiResponse<BookingResponse> cancelBooking(
            @PathVariable UUID bookingId,
            @RequestHeader("X-Auth-User-Id") UUID adminId,
            @RequestParam(required = false) String reason) {
        log.info("API Request: Admin {} cancelling booking {} with reason: {}", adminId, bookingId, reason);
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.cancelBookingByAdmin(bookingId, adminId, reason))
                .build();
    }
}