package com.badminton.communityservice.repository;

import com.badminton.communityservice.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    List<Participant> findByMatchPostIdOrderByJoinedAtAsc(UUID matchPostId);
    
    List<Participant> findByMatchPostIdAndStatus(UUID matchPostId, String status);
    
    Optional<Participant> findByMatchPostIdAndUserId(UUID matchPostId, UUID userId);
    
    boolean existsByMatchPostIdAndUserId(UUID matchPostId, UUID userId);
    
    int countByMatchPostIdAndStatus(UUID matchPostId, String status);
    
    List<Participant> findByUserIdOrderByJoinedAtDesc(UUID userId);
}
