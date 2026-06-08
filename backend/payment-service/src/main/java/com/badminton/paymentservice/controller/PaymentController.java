package com.badminton.paymentservice.controller;

import com.badminton.paymentservice.dto.CreatePaymentRequest;
import com.badminton.paymentservice.dto.CreatePaymentResponse;
import com.badminton.paymentservice.dto.MockPaymentCallbackRequest;
import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import com.badminton.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
@Slf4j
public class PaymentController {
 private final PaymentService paymentService;
 private final PaymentTransactionRepository transactionRepository;

 @GetMapping
 public Page<PaymentTransaction> getAllPayments(
   @RequestParam(required = false) String status,
   @RequestParam(defaultValue = "0") int page,
   @RequestParam(defaultValue = "10") int size) {
  log.info("Fetching all payment transactions, status={}, page={}, size={}", status, page, size);
  Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
  if (status != null && !status.isBlank()) {
   return transactionRepository.findByStatus(status, pageable);
  }
  return transactionRepository.findAll(pageable);
 }


 @PostMapping("/create")
 public CreatePaymentResponse createPayment(@RequestBody CreatePaymentRequest request) {
  PaymentTransaction tx = paymentService.createPayment(
   request.getBookingId(),
   request.getUserId(),
   request.getAmount(),
   request.getProvider(),
   request.getVenueId(),
   request.getOwnerId()
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
 @Profile("dev")
 public void mockPaymentCallback(
  @RequestHeader(value = "X-Mock-Secret", required = false, defaultValue = "dev-mock-secret") String mockSecret,
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

 @PostMapping("/refund/{bookingId}")
 public Map<String, Object> refundPayment(@PathVariable UUID bookingId) {
  try {
   paymentService.refundPayment(bookingId);
   return Map.of("success", true, "message", "Refund processed successfully");
  } catch (IllegalStateException e) {
   return Map.of("success", false, "message", e.getMessage());
  } catch (Exception e) {
   log.error("Refund failed for booking {}", bookingId, e);
   return Map.of("success", false, "message", "Refund failed: " + e.getMessage());
  }
 }
}
