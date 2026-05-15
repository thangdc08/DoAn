package com.badminton.identityservice.repository;

import com.badminton.identityservice.entity.UserAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, UUID> {
    void deleteByUserId(UUID userId);
}
