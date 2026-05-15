package com.badminton.identityservice.repository;

import com.badminton.identityservice.entity.UserPreferredArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserPreferredAreaRepository extends JpaRepository<UserPreferredArea, UUID> {
    void deleteByUserId(UUID userId);
}
