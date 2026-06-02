package com.badminton.identityservice.service.impl;

import com.badminton.common.exception.AppException;
import com.badminton.identityservice.dto.mapper.UserMapper;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.entity.Friendship;
import com.badminton.identityservice.entity.FriendshipStatus;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.repository.FriendshipRepository;
import com.badminton.identityservice.repository.UserRepository;
import com.badminton.identityservice.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public void sendFriendRequest(UUID userId, UUID friendId) {
        if (userId.equals(friendId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Không thể kết bạn với chính mình");
        }

        if (!userRepository.existsById(friendId)) {
            throw new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng");
        }

        Optional<Friendship> relationOpt = friendshipRepository.findRelation(userId, friendId);

        if (relationOpt.isPresent()) {
            Friendship relation = relationOpt.get();
            if (relation.getStatus() == FriendshipStatus.ACCEPTED) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Hai người đã là bạn bè");
            } else if (relation.getStatus() == FriendshipStatus.PENDING) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Yêu cầu kết bạn đã được gửi trước đó và đang chờ duyệt");
            } else {
                // If it was DECLINED previously, let's reset it to PENDING and update requester/receiver
                relation.setUserId(userId);
                relation.setFriendId(friendId);
                relation.setStatus(FriendshipStatus.PENDING);
                friendshipRepository.save(relation);
            }
        } else {
            Friendship newRelation = Friendship.builder()
                    .userId(userId)
                    .friendId(friendId)
                    .status(FriendshipStatus.PENDING)
                    .build();
            friendshipRepository.save(newRelation);
        }
    }

    @Override
    @Transactional
    public void acceptFriendRequest(UUID userId, UUID friendId) {
        Friendship relation = friendshipRepository.findByUserIdAndFriendId(friendId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy yêu cầu kết bạn nào từ người dùng này"));

        if (relation.getStatus() != FriendshipStatus.PENDING) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Yêu cầu kết bạn này không ở trạng thái chờ duyệt");
        }

        relation.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(relation);
    }

    @Override
    @Transactional
    public void declineFriendRequest(UUID userId, UUID friendId) {
        Friendship relation = friendshipRepository.findByUserIdAndFriendId(friendId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy yêu cầu kết bạn"));

        if (relation.getStatus() != FriendshipStatus.PENDING) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Yêu cầu kết bạn này không ở trạng thái chờ duyệt");
        }

        // Just delete the request so either of them can send request again
        friendshipRepository.delete(relation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getFriends(UUID userId) {
        List<Friendship> friendships = friendshipRepository.findAllFriends(userId, FriendshipStatus.ACCEPTED);
        
        List<UUID> friendIds = friendships.stream()
                .map(f -> f.getUserId().equals(userId) ? f.getFriendId() : f.getUserId())
                .collect(Collectors.toList());

        List<User> friends = userRepository.findAllById(friendIds);
        return friends.stream()
                .map(userMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getPendingRequests(UUID userId) {
        List<Friendship> pendingRequests = friendshipRepository.findAllByFriendIdAndStatus(userId, FriendshipStatus.PENDING);
        
        List<UUID> senderIds = pendingRequests.stream()
                .map(Friendship::getUserId)
                .collect(Collectors.toList());

        List<User> senders = userRepository.findAllById(senderIds);
        return senders.stream()
                .map(userMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public String getRelationStatus(UUID userId, UUID friendId) {
        if (userId.equals(friendId)) {
            return "SELF";
        }

        Optional<Friendship> relationOpt = friendshipRepository.findRelation(userId, friendId);
        if (relationOpt.isEmpty()) {
            return "NONE";
        }

        Friendship relation = relationOpt.get();
        if (relation.getStatus() == FriendshipStatus.ACCEPTED) {
            return "ACCEPTED";
        } else if (relation.getStatus() == FriendshipStatus.PENDING) {
            return relation.getUserId().equals(userId) ? "PENDING_SENT" : "PENDING_RECEIVED";
        }

        return "NONE";
    }

    @Override
    @Transactional
    public void removeFriend(UUID userId, UUID friendId) {
        Friendship relation = friendshipRepository.findRelation(userId, friendId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy quan hệ bạn bè giữa hai người"));

        friendshipRepository.delete(relation);
    }
}
