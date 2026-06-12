package com.badminton.communityservice.repository;

import com.badminton.communityservice.entity.MatchPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MatchPostRepository extends JpaRepository<MatchPost, UUID>, JpaSpecificationExecutor<MatchPost> {
    List<MatchPost> findByHostIdOrderByCreatedAtDesc(UUID hostId);
    
    long countByHostIdAndStatusIn(UUID hostId, List<String> statuses);
    
    List<MatchPost> findByStatusAndStartTimeBefore(String status, LocalDateTime time);
    
    List<MatchPost> findByStatusInAndEndTimeBefore(List<String> statuses, LocalDateTime time);
    
    List<MatchPost> findByStatusOrderByStartTimeAsc(String status);
    
    @Query(value = "SELECT * FROM community.match_posts " +
            "WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters) " +
            "AND status = :status " +
            "ORDER BY ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) " +
            "LIMIT :limit", nativeQuery = true)
    List<MatchPost> findNearbyMatches(@Param("lat") double lat, 
                                      @Param("lng") double lng, 
                                      @Param("radiusMeters") double radiusMeters,
                                      @Param("status") String status,
                                      @Param("limit") int limit);

    List<MatchPost> findByStatusInAndStartTimeBetweenAndReminderSent(List<String> statuses, LocalDateTime start, LocalDateTime end, Boolean reminderSent);
}
