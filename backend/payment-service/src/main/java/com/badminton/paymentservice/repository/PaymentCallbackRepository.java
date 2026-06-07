package com.badminton.paymentservice.repository;

import com.badminton.paymentservice.entity.PaymentCallback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentCallbackRepository extends JpaRepository<PaymentCallback, UUID> {
}
