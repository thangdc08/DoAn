package com.badminton.communityservice.repository;

import com.badminton.communityservice.entity.VenueTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VenueTransferRepository extends JpaRepository<VenueTransfer, UUID>, JpaSpecificationExecutor<VenueTransfer> {
    List<VenueTransfer> findBySellerIdOrderByCreatedAtDesc(UUID sellerId);
    List<VenueTransfer> findByStatusOrderByCreatedAtDesc(String status);
}
