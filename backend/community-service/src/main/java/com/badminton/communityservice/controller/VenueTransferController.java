package com.badminton.communityservice.controller;

import com.badminton.communityservice.dto.CreateVenueTransferRequest;
import com.badminton.communityservice.dto.VenueTransferResponse;
import com.badminton.communityservice.service.VenueTransferService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/community/venue-transfers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Community - Venue Transfers", description = "Endpoints for managing court pass/transfers (pass sân)")
public class VenueTransferController {

    private final VenueTransferService venueTransferService;

    @PostMapping
    @Operation(summary = "Create venue transfer post", description = "Create a new court pass slot (pass sân)")
    public ApiResponse<VenueTransferResponse> createVenueTransfer(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @Valid @RequestBody CreateVenueTransferRequest request) {
        log.info("API Request: Create venue transfer post by user {}", userId);
        return ApiResponse.<VenueTransferResponse>builder()
                .result(venueTransferService.createVenueTransfer(userId, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get venue transfers", description = "Get list of venue transfers (pass sân)")
    public ApiResponse<List<VenueTransferResponse>> getVenueTransfers(
            @RequestParam(required = false, defaultValue = "OPEN") String status) {
        log.info("API Request: Get venue transfers with status {}", status);
        return ApiResponse.<List<VenueTransferResponse>>builder()
                .result(venueTransferService.getVenueTransfers(status))
                .build();
    }

    @PostMapping("/{id}/claim")
    @Operation(summary = "Claim/Buy transfer slot", description = "Claim a venue transfer slot")
    public ApiResponse<VenueTransferResponse> claimVenueTransfer(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} claiming transfer post {}", userId, id);
        return ApiResponse.<VenueTransferResponse>builder()
                .result(venueTransferService.claimVenueTransfer(userId, id))
                .build();
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel venue transfer post", description = "Cancel a venue transfer post")
    public ApiResponse<Void> cancelVenueTransfer(
            @PathVariable UUID id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        log.info("API Request: User {} cancelling transfer post {}", userId, id);
        venueTransferService.cancelVenueTransfer(userId, id);
        return ApiResponse.<Void>builder().build();
    }
}
