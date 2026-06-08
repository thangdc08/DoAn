package com.badminton.venueservice.controller;

import com.badminton.common.dto.ApiResponse;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/venues")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin - Venue Management", description = "Admin endpoints for venue approval and management")
public class AdminVenueController {

    private final VenueService venueService;

    @GetMapping("/pending")
    @Operation(summary = "Get pending venues", description = "Admin gets list of venues pending approval")
    public ApiResponse<List<VenueResponse>> getPendingVenues() {
        log.info("API Request: Get pending venues for admin approval");
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.findVenuesByStatus("PENDING_APPROVAL"))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get all venues for admin", description = "Admin gets all venues with any status")
    public ApiResponse<Page<VenueResponse>> getAllVenuesForAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("API Request: Get all venues for admin with status={}, search={}", status, search);
        return ApiResponse.<Page<VenueResponse>>builder()
                .result(venueService.findAllVenuesForAdmin(status, search, pageable))
                .build();
    }

    @PatchMapping("/{venueId}/approve")
    @Operation(summary = "Approve venue", description = "Admin approves a pending venue")
    public ApiResponse<VenueResponse> approveVenue(
            @PathVariable UUID venueId,
            @RequestHeader("X-Auth-User-Id") UUID adminId) {
        log.info("API Request: Admin {} approving venue {}", adminId, venueId);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.approveVenue(venueId, adminId))
                .build();
    }

    @PatchMapping("/{venueId}/suspend")
    @Operation(summary = "Suspend venue", description = "Admin suspends an approved venue")
    public ApiResponse<VenueResponse> suspendVenue(
            @PathVariable UUID venueId,
            @RequestHeader("X-Auth-User-Id") UUID adminId) {
        log.info("API Request: Admin {} suspending venue {}", adminId, venueId);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.suspendVenue(venueId, adminId))
                .build();
    }

    @PatchMapping("/{venueId}/reject")
    @Operation(summary = "Reject venue", description = "Admin rejects a pending venue")
    public ApiResponse<VenueResponse> rejectVenue(
            @PathVariable UUID venueId,
            @RequestHeader("X-Auth-User-Id") UUID adminId,
            @RequestParam(required = false) String reason) {
        log.info("API Request: Admin {} rejecting venue {} with reason: {}", adminId, venueId, reason);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.rejectVenue(venueId, adminId, reason))
                .build();
    }

    @DeleteMapping("/{venueId}")
    @Operation(summary = "Delete venue", description = "Admin deletes a venue")
    public ApiResponse<Void> deleteVenue(
            @PathVariable UUID venueId,
            @RequestHeader("X-Auth-User-Id") UUID adminId) {
        log.info("API Request: Admin {} deleting venue {}", adminId, venueId);
        venueService.deleteVenueByAdmin(venueId, adminId);
        return ApiResponse.<Void>builder().build();
    }
}