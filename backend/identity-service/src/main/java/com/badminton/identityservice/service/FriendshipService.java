package com.badminton.identityservice.service;

import com.badminton.identityservice.dto.model.UserDTO;

import java.util.List;
import java.util.UUID;

public interface FriendshipService {
    void sendFriendRequest(UUID userId, UUID friendId);
    void acceptFriendRequest(UUID userId, UUID friendId);
    void declineFriendRequest(UUID userId, UUID friendId);
    List<UserDTO> getFriends(UUID userId);
    List<UserDTO> getPendingRequests(UUID userId);
    String getRelationStatus(UUID userId, UUID friendId);
    void removeFriend(UUID userId, UUID friendId);
}
