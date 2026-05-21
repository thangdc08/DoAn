package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.dto.RevenueStatsResponse;
import com.badminton.bookingservice.service.BookingService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/owner/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Owner - Booking Management", description = "Owner endpoints for viewing bookings and revenue")
public class OwnerBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get owner bookings", description = "Owner gets bookings for their venues")
    public ApiResponse<Page<BookingResponse>> getOwnerBookings(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestParam(required = false) UUID venueId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("API Request: Owner {} getting bookings for venueId={}, status={}", ownerId, venueId, status);
        return ApiResponse.<Page<BookingResponse>>builder()
                .result(bookingService.getBookingsForOwner(ownerId, venueId, status, pageable))
                .build();
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get revenue statistics", description = "Owner gets revenue statistics for their venues")
    public ApiResponse<RevenueStatsResponse> getRevenueStats(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestParam(required = false) UUID venueId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        log.info("API Request: Owner {} getting revenue stats for venueId={}, from={}, to={}", 
                ownerId, venueId, fromDate, toDate);
        return ApiResponse.<RevenueStatsResponse>builder()
                .result(bookingService.getRevenueStats(ownerId, venueId, fromDate, toDate))
                .build();
    }
}