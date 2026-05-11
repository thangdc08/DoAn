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

    @Transactional
    public PaymentTransaction createPayment(UUID bookingId, UUID userId, BigDecimal amount) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .bookingId(bookingId)
                .userId(userId)
                .amount(amount)
                .provider("MOCK")
                .status("PENDING")
                .paymentUrl("http://localhost:3000/mock-payment?bookingId=" + bookingId)
                .build();

        return transactionRepository.save(transaction);
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
