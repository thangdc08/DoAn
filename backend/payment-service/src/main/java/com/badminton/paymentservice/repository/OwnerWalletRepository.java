package com.badminton.paymentservice.repository;

import com.badminton.paymentservice.entity.OwnerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OwnerWalletRepository extends JpaRepository<OwnerWallet, UUID> {
    Optional<OwnerWallet> findByOwnerId(UUID ownerId);
}
