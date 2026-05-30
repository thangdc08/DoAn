package com.badminton.venueservice.controller;

import com.badminton.common.dto.ApiResponse;
import com.badminton.venueservice.dto.*;
import com.badminton.venueservice.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
                    .message("KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin Ä‘á»‹nh danh ngÆ°á» i dÃ¹ng (X-Auth-User-Id header is missing)")
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

    @GetMapping("/{venueId}/courts/{courtId}/availability")
    @Operation(summary = "Get court availability", description = "Returns the availability status of all slots for a specific date")
    public ApiResponse<List<CourtSlotResponse>> getAvailability(
            @PathVariable UUID venueId,
            @PathVariable UUID courtId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        log.info("API Request: Get availability for court {} on {}", courtId, date);
        return ApiResponse.<List<CourtSlotResponse>>builder()
                .result(venueService.getCourtAvailability(venueId, courtId, date))
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

    @PutMapping("/{venueId}/courts/{courtId}")
    @Operation(summary = "Update court info", description = "Allows owners to update specific court details")
    public ApiResponse<CourtResponse> updateCourt(
            @PathVariable UUID venueId,
            @PathVariable UUID courtId,
            @RequestBody UpdateCourtRequest request) {
        log.info("API Request: Update court {} for venue {}", courtId, venueId);
        return ApiResponse.<CourtResponse>builder()
                .result(venueService.updateCourt(venueId, courtId, request))
                .message("Cập nhật thông tin sân thành công")
                .build();
    }

    @PutMapping("/{venueId}/courts/{courtId}/availability")
    @Operation(summary = "Update court availability", description = "Allows owners to lock/unlock specific slots for a date range")
    public ApiResponse<Void> updateAvailability(
            @PathVariable UUID venueId,
            @PathVariable UUID courtId,
            @RequestBody UpdateCourtAvailabilityRequest request) {
        log.info("API Request: Update availability for court {} for range {} to {}", 
                courtId, request.getStartDate(), request.getEndDate());
        venueService.updateCourtAvailability(venueId, courtId, request);
        return ApiResponse.<Void>builder()
                .message("Cập nhật lịch sân thành công")
                .build();
    }

    @PutMapping("/{venueId}/courts/{courtId}/slots/toggle-lock")
    @Operation(summary = "Toggle slot lock", description = "Allows owners to quickly lock or unlock a specific slot")
    public ApiResponse<CourtSlotResponse> toggleSlotLock(
            @PathVariable UUID venueId,
            @PathVariable UUID courtId,
            @RequestBody ToggleSlotLockRequest request) {
        log.info("API Request: Toggle lock for court {} in venue {}", courtId, venueId);
        CourtSlotResponse result = venueService.toggleCourtSlotLock(venueId, courtId, request);
        return ApiResponse.<CourtSlotResponse>builder()
                .result(result)
                .message(request.isLock() ? "Khóa sân thành công" : "Mở khóa sân thành công")
                .build();
    }

    @PostMapping("/{venueId}/courts")
    @Operation(summary = "Create new court", description = "Allows owners to add a new court to their venue")
    public ApiResponse<CourtResponse> createCourt(
            @PathVariable UUID venueId,
            @RequestBody CreateCourtRequest request) {
        log.info("API Request: Create court {} for venue {}", request.getName(), venueId);
        return ApiResponse.<CourtResponse>builder()
                .result(venueService.createCourt(venueId, request))
                .message("Thêm sân mới thành công")
                .build();
    }

    @DeleteMapping("/{venueId}/courts/{courtId}")
    @Operation(summary = "Delete court", description = "Deletes a specific court from a venue")
    public ApiResponse<Void> deleteCourt(
            @PathVariable UUID venueId,
            @PathVariable UUID courtId) {
        log.info("API Request: Delete court {} for venue {}", courtId, venueId);
        venueService.deleteCourt(venueId, courtId);
        return ApiResponse.<Void>builder()
                .message("Xóa sân thành công")
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

    @GetMapping("/{venueId}/price-rules")
    @Operation(summary = "Get price rules", description = "Returns all price rules for a specific venue")
    public ApiResponse<List<PriceRuleResponse>> getPriceRules(@PathVariable UUID venueId) {
        log.info("API Request: Get price rules for venue {}", venueId);
        return ApiResponse.<List<PriceRuleResponse>>builder()
                .result(venueService.findPriceRulesByVenueId(venueId))
                .build();
    }

    @PostMapping("/{venueId}/price-rules")
    @Operation(summary = "Create price rule", description = "Allows owners to add a new price rule")
    public ApiResponse<PriceRuleResponse> createPriceRule(
            @PathVariable UUID venueId,
            @RequestBody CreatePriceRuleRequest request) {
        log.info("API Request: Create price rule for venue {}", venueId);
        return ApiResponse.<PriceRuleResponse>builder()
                .result(venueService.createPriceRule(venueId, request))
                .message("Thêm khung giờ giá thành công")
                .build();
    }

    @DeleteMapping("/{venueId}/price-rules/{ruleId}")
    @Operation(summary = "Delete price rule", description = "Allows owners to delete a specific price rule")
    public ApiResponse<Void> deletePriceRule(
            @PathVariable UUID venueId,
            @PathVariable UUID ruleId) {
        log.info("API Request: Delete price rule {} for venue {}", ruleId, venueId);
        venueService.deletePriceRule(venueId, ruleId);
        return ApiResponse.<Void>builder()
                .message("Xóa quy tắc giá thành công")
                .build();
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get venues nearby", description = "Returns a list of approved venues sorted by distance")
    public ApiResponse<List<VenueResponse>> getNearbyVenues(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) Double radiusKm,
            @RequestParam(required = false) Integer limit) {
        log.info("API Request: Get nearby venues lat={}, lng={}", lat, lng);
        return ApiResponse.<List<VenueResponse>>builder()
                .result(venueService.findNearbyVenues(lat, lng, radiusKm, limit))
                .build();
    }

    @PostMapping("/ratings/upload-images")
    @Operation(summary = "Upload rating images", description = "Allows users to upload images for their rating before submitting")
    public ApiResponse<List<String>> uploadRatingImages(
            @RequestParam("images") List<org.springframework.web.multipart.MultipartFile> images) {
        log.info("API Request: Upload {} rating images", images.size());
        return ApiResponse.<List<String>>builder()
                .result(venueService.uploadRatingImages(images))
                .message("Tải ảnh lên thành công")
                .build();
    }

    @PostMapping("/{venueId}/ratings")
    @Operation(summary = "Rate a venue", description = "Allows users with a paid booking to submit a rating")
    public ApiResponse<VenueRatingResponse> createRating(
            @PathVariable UUID venueId,
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestBody VenueRatingRequest request) {
        log.info("API Request: User {} rating venue {}", userId, venueId);
        return ApiResponse.<VenueRatingResponse>builder()
                .result(venueService.createVenueRating(userId, venueId, request))
                .message("Đánh giá sân thành công")
                .build();
    }

    @GetMapping("/{venueId}/ratings")
    @Operation(summary = "Get venue ratings", description = "Returns paginated list of ratings for a venue")
    public ApiResponse<Page<VenueRatingResponse>> getVenueRatings(
            @PathVariable UUID venueId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("API Request: Get ratings for venue {}", venueId);
        return ApiResponse.<Page<VenueRatingResponse>>builder()
                .result(venueService.getVenueRatings(venueId, pageable))
                .build();
    }
}
