package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.*;
import com.badminton.bookingservice.service.SupportTicketService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings/{bookingId}/support-tickets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Support Tickets - User", description = "User endpoints for support tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    @PostMapping
    @Operation(summary = "Create support ticket for a booking")
    public ApiResponse<SupportTicketResponse> createTicket(
            @PathVariable UUID bookingId,
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @Valid @RequestBody CreateSupportTicketRequest request) {
        log.info("User {} creating support ticket for booking {}", userId, bookingId);
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.createTicket(bookingId, userId, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get support tickets for current user")
    public ApiResponse<Page<SupportTicketResponse>> getUserTickets(
            @PathVariable UUID bookingId,
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("User {} fetching own support tickets", userId);
        return ApiResponse.<Page<SupportTicketResponse>>builder()
                .result(supportTicketService.getUserTickets(userId, status, pageable))
                .build();
    }
}
