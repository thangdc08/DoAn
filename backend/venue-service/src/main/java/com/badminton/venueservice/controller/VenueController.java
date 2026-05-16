package com.badminton.venueservice.controller;

import com.badminton.common.dto.ApiResponse;
import com.badminton.venueservice.dto.*;
import com.badminton.venueservice.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/my")
    @Operation(summary = "Get my venues", description = "Returns all venues belonging to the current owner")
    public ApiResponse<List<VenueResponse>> getMyVenues(
            @RequestHeader(value = "X-Auth-User-Id", required = false) UUID ownerId) {
        log.info("API Request: Get my venues. Received X-Auth-User-Id: {}", ownerId);
        
        if (ownerId == null) {
            log.warn("X-Auth-User-Id header is missing!");
            return ApiResponse.<List<VenueResponse>>builder()
                    .code(HttpStatus.UNAUTHORIZED.value())
                    .message("KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin Ä‘á»‹nh danh ngÆ°á»i dÃ¹ng (X-Auth-User-Id header is missing)")
                    .build();
        }
        
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.findVenuesByOwnerId(ownerId))
                .build();
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get venues by owner ID", description = "Returns all venues belonging to a specific owner")
    public ApiResponse<List<VenueResponse>> getVenuesByOwner(@PathVariable UUID ownerId) {
        log.info("API Request: Get venues for owner {}", ownerId);
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.findVenuesByOwnerId(ownerId))
                .build();
    }

    @GetMapping("/{venueId}/courts")
    @Operation(summary = "Get courts by venue ID", description = "Returns all courts belonging to a specific venue")
    public ApiResponse<List<CourtResponse>> getCourtsByVenue(@PathVariable UUID venueId) {
        log.info("API Request: Get courts for venue {}", venueId);
        return ApiResponse.<List<CourtResponse>>builder()
                .result(venueService.findCourtsByVenueId(venueId))
                .build();
    }



    @PutMapping("/{venueId}/courts/reorder")
    @Operation(summary = "Reorder courts", description = "Allows owners to change the display order of courts")
    public ApiResponse<Void> reorderCourts(
            @PathVariable UUID venueId,
            @RequestBody List<UUID> courtIds) {
        log.info("API Request: Reorder courts for venue {}", venueId);
        venueService.reorderCourts(venueId, courtIds);
        return ApiResponse.<Void>builder()
                .message("Cập nhật thứ tự sân thành công")
                .build();
    }
    @PostMapping
    @Operation(summary = "Create new venue", description = "Allows owners to register a new badminton venue")
    public ApiResponse<VenueResponse> createVenue(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestBody CreateVenueRequest request) {
        log.info("API Request: Create venue '{}' for owner {}", request.getName(), ownerId);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.createVenue(ownerId, request))
                .build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update venue", description = "Allows owners to update their venue information")
    public ApiResponse<VenueResponse> updateVenue(
            @PathVariable UUID id,
            @RequestBody UpdateVenueRequest request) {
        log.info("API Request: Update venue {}", id);
        return ApiResponse.<VenueResponse>builder()
                .result(venueService.updateVenue(id, request))
                .build();
    }




    @PostMapping("/{id}/images")
    @Operation(summary = "Upload venue images", description = "Allows owners to upload images for their venue")
    public ApiResponse<Void> uploadVenueImages(
            @PathVariable UUID id,
            @RequestParam("images") List<org.springframework.web.multipart.MultipartFile> images) {
        log.info("API Request: Upload {} images for venue {}", images.size(), id);
        venueService.uploadVenueImages(id, images);
        return ApiResponse.<Void>builder()
                .message("Táº£i áº£nh lÃªn thÃ nh cÃ´ng")
                .build();
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @Operation(summary = "Delete venue image", description = "Allows owners to delete a specific image of their venue")
    public ApiResponse<Void> deleteVenueImage(
            @PathVariable UUID id,
            @PathVariable UUID imageId) {
        log.info("API Request: Delete image {} for venue {}", imageId, id);
        venueService.deleteVenueImage(id, imageId);
        return ApiResponse.<Void>builder()
                .message("Xóa ?nh thành công")
                .build();
    }


    @DeleteMapping("/{id}")
    @Operation(summary = "Delete venue", description = "Deletes a venue and all associated data")
    public ApiResponse<Void> deleteVenue(@PathVariable UUID id) {
        venueService.deleteVenue(id);
        return ApiResponse.<Void>builder()
                .message("Venue deleted successfully")
                .build();
    }
}

