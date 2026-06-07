package com.badminton.paymentservice.repository;

import com.badminton.paymentservice.entity.PayoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PayoutRequestRepository extends JpaRepository<PayoutRequest, UUID> {
    List<PayoutRequest> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
    List<PayoutRequest> findAllByOrderByCreatedAtDesc();
}
