package com.badminton.paymentservice.service;

import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.event.PaymentSucceededEvent;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentEventPublisher eventPublisher;
    private static final String SANDBOX_WEB_BASE_URL = "http://localhost:5173";

    @Transactional
    public PaymentTransaction createPayment(UUID bookingId, UUID userId, BigDecimal amount, String provider) {
        String selectedProvider = (provider == null || provider.isBlank()) ? "MOCK" : provider.toUpperCase();
        PaymentTransaction transaction = PaymentTransaction.builder()
                .bookingId(bookingId)
                .userId(userId)
                .amount(amount)
                .provider(selectedProvider)
                .status("PENDING")
                .build();

        PaymentTransaction saved = transactionRepository.save(transaction);
        saved.setPaymentUrl(SANDBOX_WEB_BASE_URL + "/mock-payment?transactionId=" + saved.getId());
        return transactionRepository.save(saved);
    }

    @Transactional
    public void processMockCallback(UUID transactionId, boolean success) {
        PaymentTransaction transaction = transactionRepository.findById(transactionId).orElseThrow();
        
        if (success) {
            transaction.setStatus("SUCCESS");
            transaction.setPaidAt(LocalDateTime.now());
            transactionRepository.save(transaction);

            eventPublisher.publishPaymentSucceeded(PaymentSucceededEvent.builder()
                    .eventId(UUID.randomUUID())
                    .eventType("PaymentSucceeded")
                    .bookingId(transaction.getBookingId())
                    .transactionId(transaction.getId())
                    .userId(transaction.getUserId())
                    .amount(transaction.getAmount())
                    .paidAt(transaction.getPaidAt())
                    .build());
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
        }
    }
}
