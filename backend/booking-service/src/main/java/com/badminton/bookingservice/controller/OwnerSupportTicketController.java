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
@RequestMapping("/api/owner/support-tickets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Owner - Support Tickets", description = "Owner endpoints for support tickets")
public class OwnerSupportTicketController {

    private final SupportTicketService supportTicketService;

    @PostMapping
    @Operation(summary = "Create support ticket for an owner")
    public ApiResponse<SupportTicketResponse> createTicket(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @Valid @RequestBody CreateSupportTicketRequest request) {
        log.info("Owner {} creating support ticket", ownerId);
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.createTicket(null, ownerId, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get support tickets for current owner")
    public ApiResponse<Page<SupportTicketResponse>> getOwnerTickets(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Owner {} fetching own support tickets", ownerId);
        return ApiResponse.<Page<SupportTicketResponse>>builder()
                .result(supportTicketService.getUserTickets(ownerId, status, pageable))
                .build();
    }

    @PatchMapping("/{ticketId}/reply")
    @Operation(summary = "Reply to a support ticket as owner")
    public ApiResponse<SupportTicketResponse> replyTicket(
            @PathVariable UUID ticketId,
            @Valid @RequestBody ReplyTicketRequest request) {
        log.info("Owner replying to ticket {}", ticketId);
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.replyTicket(ticketId, request.getReply()))
                .build();
    }
}
