package com.badminton.venueservice.repository;

import com.badminton.venueservice.entity.Venue;
import com.badminton.common.constant.VenueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.UUID;

public interface VenueRepository extends JpaRepository<Venue, UUID> {
    List<Venue> findByCity(String city);
    List<Venue> findByStatus(VenueStatus status);
    List<Venue> findByOwnerId(UUID ownerId);
    
    @Query(value = "SELECT * FROM venue.venues v WHERE ST_DWithin(v.location, :point, :distance)", nativeQuery = true)
    List<Venue> findNearby(@Param("point") Point point, @Param("distance") double distance);
}
