package com.badminton.bookingservice.service;

import com.badminton.bookingservice.dto.*;
import com.badminton.bookingservice.entity.SupportTicket;
import com.badminton.bookingservice.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;

    // ── User: create ticket ────────────────────────────────────────────────

    @Transactional
    public SupportTicketResponse createTicket(UUID bookingId, UUID userId, CreateSupportTicketRequest req) {
        SupportTicket ticket = SupportTicket.builder()
                .bookingId(bookingId)
                .userId(userId)
                .subject(req.getSubject())
                .description(req.getDescription())
                .status("OPEN")
                .build();
        return toResponse(ticketRepository.save(ticket));
    }

    // ── User: list own tickets ─────────────────────────────────────────────

    public Page<SupportTicketResponse> getUserTickets(UUID userId, String status, Pageable pageable) {
        Page<SupportTicket> page = (status != null && !status.isBlank())
                ? ticketRepository.findByUserIdAndStatus(userId, status, pageable)
                : ticketRepository.findByUserId(userId, pageable);
        return page.map(this::toResponse);
    }

    // ── Admin: list all tickets ────────────────────────────────────────────

    public Page<SupportTicketResponse> getAllTickets(String status, Pageable pageable) {
        Page<SupportTicket> page = (status != null && !status.isBlank())
                ? ticketRepository.findByStatus(status, pageable)
                : ticketRepository.findAll(pageable);
        return page.map(this::toResponse);
    }

    // ── Admin: reply ───────────────────────────────────────────────────────

    @Transactional
    public SupportTicketResponse replyTicket(UUID ticketId, String reply) {
        SupportTicket ticket = findOrThrow(ticketId);
        ticket.setReply(reply);
        ticket.setRepliedAt(LocalDateTime.now());
        if ("OPEN".equals(ticket.getStatus())) {
            ticket.setStatus("IN_PROGRESS");
        }
        return toResponse(ticketRepository.save(ticket));
    }

    // ── Admin: update status ───────────────────────────────────────────────

    @Transactional
    public SupportTicketResponse updateStatus(UUID ticketId, String status) {
        SupportTicket ticket = findOrThrow(ticketId);
        ticket.setStatus(status);
        return toResponse(ticketRepository.save(ticket));
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private SupportTicket findOrThrow(UUID id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Support ticket not found: " + id));
    }

    private SupportTicketResponse toResponse(SupportTicket t) {
        return SupportTicketResponse.builder()
                .id(t.getId())
                .bookingId(t.getBookingId())
                .userId(t.getUserId())
                .subject(t.getSubject())
                .description(t.getDescription())
                .status(t.getStatus())
                .reply(t.getReply())
                .repliedAt(t.getRepliedAt())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
