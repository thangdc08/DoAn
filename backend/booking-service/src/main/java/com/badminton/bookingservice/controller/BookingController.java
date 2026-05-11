package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.entity.Booking;
import com.badminton.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestParam UUID userId) {
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
