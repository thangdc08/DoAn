package com.badminton.paymentservice.controller;

import com.badminton.paymentservice.dto.CreatePaymentRequest;
import com.badminton.paymentservice.dto.CreatePaymentResponse;
import com.badminton.paymentservice.dto.MockPaymentCallbackRequest;
import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import com.badminton.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentTransactionRepository transactionRepository;

    @PostMapping("/create")
    public CreatePaymentResponse createPayment(@RequestBody CreatePaymentRequest request) {
        PaymentTransaction tx = paymentService.createPayment(
                request.getBookingId(),
                request.getUserId(),
                request.getAmount(),
                request.getProvider()
        );

        return CreatePaymentResponse.builder()
                .transactionId(tx.getId())
                .bookingId(tx.getBookingId())
                .amount(tx.getAmount())
                .provider(tx.getProvider())
                .status(tx.getStatus())
                .paymentUrl(tx.getPaymentUrl())
                .build();
    }

    @GetMapping("/{transactionId}")
    public PaymentTransaction getPaymentById(@PathVariable UUID transactionId) {
        return transactionRepository.findById(transactionId).orElseThrow();
    }

    @PostMapping("/mock/callback")
    public void mockPaymentCallback(@RequestBody MockPaymentCallbackRequest request) {
        paymentService.processMockCallback(request.getTransactionId(), request.isSuccess());
    }
}
