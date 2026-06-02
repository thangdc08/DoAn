package com.badminton.identityservice.repository;

import com.badminton.identityservice.entity.Friendship;
import com.badminton.identityservice.entity.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    
    Optional<Friendship> findByUserIdAndFriendId(UUID userId, UUID friendId);

    @Query("SELECT f FROM Friendship f WHERE (f.userId = :userId AND f.friendId = :friendId) OR (f.userId = :friendId AND f.friendId = :userId)")
    Optional<Friendship> findRelation(UUID userId, UUID friendId);

    List<Friendship> findAllByFriendIdAndStatus(UUID friendId, FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE (f.userId = :userId OR f.friendId = :userId) AND f.status = :status")
    List<Friendship> findAllFriends(UUID userId, FriendshipStatus status);
}
