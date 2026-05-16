package com.badminton.venueservice.repository;

import com.badminton.venueservice.entity.VenueImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface VenueImageRepository extends JpaRepository<VenueImage, UUID> {
    List<VenueImage> findByVenueId(UUID venueId);
    void deleteByVenueId(UUID venueId);
}
