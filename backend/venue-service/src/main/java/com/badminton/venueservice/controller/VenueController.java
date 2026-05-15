package com.badminton.venueservice.controller;

import com.badminton.common.dto.ApiResponse;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Venue Management", description = "Endpoints for discovering and managing badminton venues")
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    @Operation(summary = "Get all venues", description = "Returns a list of all badminton venues.")
    public ApiResponse<List<VenueResponse>> getAllVenues() {
        log.info("API Request: Get all venues");
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get venue by ID", description = "Returns venue details by unique ID")
    public ApiResponse<VenueResponse> getVenueById(@PathVariable UUID id) {
        log.info("API Request: Get venue by id {}", id);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.findVenueResponseById(id))
                .build();
    }
}
