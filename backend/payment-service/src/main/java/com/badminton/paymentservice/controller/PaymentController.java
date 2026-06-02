package com.badminton.paymentservice.controller;

import com.badminton.paymentservice.dto.CreatePaymentRequest;
import com.badminton.paymentservice.dto.CreatePaymentResponse;
import com.badminton.paymentservice.dto.MockPaymentCallbackRequest;
import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import com.badminton.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.lang.RuntimeException;
import java.net.URI;
import java.util.Map;
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
    public void mockPaymentCallback(
            @RequestHeader(value = "X-Mock-Secret", required = true) String mockSecret,
            @RequestBody MockPaymentCallbackRequest request) {
        if (!"dev-mock-secret".equals(mockSecret)) {
            throw new RuntimeException("Invalid mock secret");
        }
        paymentService.processMockCallback(request.getTransactionId(), request.isSuccess());
    }

    @GetMapping("/vnpay/callback")
    public ResponseEntity<Void> vnpayCallback(@RequestParam Map<String, String> queryParams) {
        boolean success = paymentService.processVnpayCallback(queryParams);
        String redirectUrl = paymentService.getVnpayFrontendUrl() + "?status=" + (success ? "success" : "failed");

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/vnpay/ipn")
    public Map<String, String> vnpayIpn(@RequestParam Map<String, String> queryParams) {
        return paymentService.processVnpayIpn(queryParams);
    }
}
