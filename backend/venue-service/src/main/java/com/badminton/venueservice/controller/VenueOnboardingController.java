package com.badminton.venueservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.venueservice.dto.OnboardVenueRequest;
import com.badminton.venueservice.dto.VenueResponse;
import com.badminton.venueservice.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueOnboardingController {

    private final VenueService venueService;

    @ApiMessage("Đăng ký thông tin sân (Partner Onboarding)")
    @PostMapping("/onboard")
    public ResponseEntity<VenueResponse> onboardVenue(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestBody @Valid OnboardVenueRequest request) {
        
        // Ghi chú: X-Auth-User-Id được truyền từ API Gateway sau khi xác thực JWT
        return ResponseEntity.status(HttpStatus.CREATED).body(venueService.onboardVenue(ownerId, request));
    }
}
