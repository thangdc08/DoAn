package com.badminton.paymentservice.repository;

import com.badminton.paymentservice.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    Optional<PaymentTransaction> findByBookingIdAndStatusAndRefundedFalse(UUID bookingId, String status);
    List<PaymentTransaction> findByBookingId(UUID bookingId);
}
