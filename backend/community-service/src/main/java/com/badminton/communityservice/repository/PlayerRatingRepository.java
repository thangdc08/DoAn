package com.badminton.communityservice.repository;

import com.badminton.communityservice.entity.PlayerRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlayerRatingRepository extends JpaRepository<PlayerRating, UUID> {
    Optional<PlayerRating> findByMatchPostIdAndRateeId(UUID matchPostId, UUID rateeId);
    
    List<PlayerRating> findByRateeIdOrderByCreatedAtDesc(UUID rateeId);
    
    boolean existsByMatchPostIdAndRateeId(UUID matchPostId, UUID rateeId);
    
    @Query("SELECT AVG(r.stars) FROM PlayerRating r WHERE r.rateeId = :userId")
    Double getAverageRatingForUser(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(r) FROM PlayerRating r WHERE r.rateeId = :userId")
    Long getRatingCountForUser(@Param("userId") UUID userId);
}
