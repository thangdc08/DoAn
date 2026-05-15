package com.badminton.venueservice.controller;

import com.badminton.venueservice.entity.Venue;
import com.badminton.venueservice.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class VenueInternalController {

    private final VenueService venueService;

    @GetMapping("/venues/{id}")
    public Venue getVenueById(@PathVariable UUID id) {
        return venueService.findById(id);
    }

    @GetMapping("/courts/{courtId}/price")
    public BigDecimal getPrice(
            @PathVariable UUID courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return venueService.calculatePrice(courtId, startTime, endTime);
    }
}
