package com.badminton.venueservice.repository;

import com.badminton.venueservice.entity.VenueRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface VenueRatingRepository extends JpaRepository<VenueRating, UUID> {
    Optional<VenueRating> findByVenueIdAndUserId(UUID venueId, UUID userId);
    
    Page<VenueRating> findByVenueId(UUID venueId, Pageable pageable);

    @Query("SELECT AVG(r.stars) FROM VenueRating r WHERE r.venueId = :venueId")
    Double getAverageStarsByVenueId(@Param("venueId") UUID venueId);

    long countByVenueId(UUID venueId);
}
