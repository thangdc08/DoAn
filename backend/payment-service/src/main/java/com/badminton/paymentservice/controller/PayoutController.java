package com.badminton.paymentservice.controller;

import com.badminton.paymentservice.entity.OwnerWallet;
import com.badminton.paymentservice.entity.PayoutRequest;
import com.badminton.paymentservice.service.PayoutService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payouts")
@RequiredArgsConstructor
@Slf4j
public class PayoutController {

    private final PayoutService payoutService;

    @GetMapping("/wallet")
    public OwnerWallet getWallet(@RequestHeader("X-Auth-User-Id") UUID ownerId) {
        return payoutService.getOrCreateWallet(ownerId);
    }

    @PostMapping("/request")
    public PayoutRequest createPayoutRequest(
            @RequestHeader("X-Auth-User-Id") UUID ownerId,
            @RequestBody PayoutRequestDto dto) {
        return payoutService.createPayoutRequest(
                ownerId,
                dto.getAmount(),
                dto.getBankName(),
                dto.getBankAccount(),
                dto.getBankAccountName(),
                dto.getNotes()
        );
    }

    @GetMapping("/owner/history")
    public List<PayoutRequest> getOwnerHistory(@RequestHeader("X-Auth-User-Id") UUID ownerId) {
        return payoutService.getPayoutRequestsByOwner(ownerId);
    }

    @GetMapping("/admin/requests")
    public List<PayoutRequest> getAllRequestsForAdmin(@RequestHeader("X-Auth-User-Id") UUID adminId) {
        log.info("Admin {} fetching all payout requests", adminId);
        return payoutService.getAllPayoutRequests();
    }

    @PostMapping("/admin/approve/{requestId}")
    public PayoutRequest approvePayout(
            @RequestHeader("X-Auth-User-Id") UUID adminId,
            @PathVariable UUID requestId,
            @RequestBody AdminActionDto dto) {
        log.info("Admin {} approving payout {}", adminId, requestId);
        return payoutService.approvePayout(requestId, dto.getAdminNotes());
    }

    @PostMapping("/admin/reject/{requestId}")
    public PayoutRequest rejectPayout(
            @RequestHeader("X-Auth-User-Id") UUID adminId,
            @PathVariable UUID requestId,
            @RequestBody AdminActionDto dto) {
        log.info("Admin {} rejecting payout {}", adminId, requestId);
        return payoutService.rejectPayout(requestId, dto.getAdminNotes());
    }



    @Data
    public static class PayoutRequestDto {
        private BigDecimal amount;
        private String bankName;
        private String bankAccount;
        private String bankAccountName;
        private String notes;
    }

    @Data
    public static class AdminActionDto {
        private String adminNotes;
    }
}
