package com.badminton.bookingservice.controller;

import com.badminton.bookingservice.dto.*;
import com.badminton.bookingservice.service.SupportTicketService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/support-tickets")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin - Support Tickets", description = "Admin endpoints for managing all support tickets")
public class AdminSupportTicketController {

    private final SupportTicketService supportTicketService;

    @GetMapping
    @Operation(summary = "List all support tickets with optional status filter")
    public ApiResponse<Page<SupportTicketResponse>> getAllTickets(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 50, sort = "createdAt") Pageable pageable) {
        log.info("Admin fetching all support tickets with status={}", status);
        return ApiResponse.<Page<SupportTicketResponse>>builder()
                .result(supportTicketService.getAllTickets(status, pageable))
                .build();
    }

    @PatchMapping("/{ticketId}/reply")
    @Operation(summary = "Reply to a support ticket")
    public ApiResponse<SupportTicketResponse> replyTicket(
            @PathVariable UUID ticketId,
            @RequestBody ReplyTicketRequest request) {
        log.info("Admin replying to ticket {}", ticketId);
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.replyTicket(ticketId, request.getReply()))
                .build();
    }

    @PatchMapping("/{ticketId}/status")
    @Operation(summary = "Update ticket status")
    public ApiResponse<SupportTicketResponse> updateStatus(
            @PathVariable UUID ticketId,
            @RequestBody UpdateTicketStatusRequest request) {
        log.info("Admin updating ticket {} status to {}", ticketId, request.getStatus());
        return ApiResponse.<SupportTicketResponse>builder()
                .result(supportTicketService.updateStatus(ticketId, request.getStatus()))
                .build();
    }
}
