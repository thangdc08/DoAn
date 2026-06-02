package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.service.FriendshipService;
import com.badminton.identityservice.utils.CustomHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/request")
    @ApiMessage("Gửi yêu cầu kết bạn")
    public ResponseEntity<Void> sendFriendRequest(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId,
            @RequestParam UUID friendId) {
        friendshipService.sendFriendRequest(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    @ApiMessage("Chấp nhận yêu cầu kết bạn")
    public ResponseEntity<Void> acceptFriendRequest(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId,
            @RequestParam UUID friendId) {
        friendshipService.acceptFriendRequest(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline")
    @ApiMessage("Từ chối yêu cầu kết bạn")
    public ResponseEntity<Void> declineFriendRequest(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId,
            @RequestParam UUID friendId) {
        friendshipService.declineFriendRequest(userId, friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @ApiMessage("Lấy danh sách bạn bè")
    public ResponseEntity<List<UserDTO>> getFriends(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId) {
        return ResponseEntity.ok(friendshipService.getFriends(userId));
    }

    @GetMapping("/pending")
    @ApiMessage("Lấy danh sách yêu cầu kết bạn chờ duyệt")
    public ResponseEntity<List<UserDTO>> getPendingRequests(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(userId));
    }

    @GetMapping("/status")
    @ApiMessage("Lấy trạng thái mối quan hệ")
    public ResponseEntity<String> getRelationStatus(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId,
            @RequestParam UUID friendId) {
        return ResponseEntity.ok(friendshipService.getRelationStatus(userId, friendId));
    }

    @DeleteMapping
    @ApiMessage("Hủy kết bạn")
    public ResponseEntity<Void> removeFriend(
            @RequestHeader(CustomHeaders.X_AUTH_USER_ID) UUID userId,
            @RequestParam UUID friendId) {
        friendshipService.removeFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }
}
