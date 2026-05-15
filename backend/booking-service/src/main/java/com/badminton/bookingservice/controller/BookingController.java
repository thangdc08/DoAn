package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.BookingResponse;
import com.badminton.bookingservice.service.BookingService;
import com.badminton.bookingservice.repository.BookingRepository;
import com.badminton.bookingservice.mapper.BookingMapper;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/my")
    @Operation(summary = "Get my bookings", description = "Returns a list of bookings for the specified user")
    public ApiResponse<List<BookingResponse>> getMyBookings(@RequestParam UUID userId) {
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
}
