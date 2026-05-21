package com.badminton.notificationservice.controller;

import com.badminton.notificationservice.dto.NotificationResponse;
import com.badminton.notificationservice.dto.UnreadCountResponse;
import com.badminton.notificationservice.service.NotificationService;
import com.badminton.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "Endpoints for managing user notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    @Operation(summary = "Get my notifications", description = "Get paginated list of notifications for current user")
    public ApiResponse<Page<NotificationResponse>> getMyNotifications(
            @RequestHeader("X-Auth-User-Id") UUID userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        log.info("API Request: Get notifications for user {}", userId);
        return ApiResponse.<Page<NotificationResponse>>builder()
                .result(notificationService.getMyNotifications(userId, pageable))
                .build();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count", description = "Get count of unread notifications for current user")
    public ApiResponse<UnreadCountResponse> getUnreadCount(
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        
        log.info("API Request: Get unread count for user {}", userId);
        return ApiResponse.<UnreadCountResponse>builder()
                .result(notificationService.getUnreadCount(userId))
                .build();
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    public ApiResponse<NotificationResponse> markAsRead(
            @PathVariable String id,
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        
        log.info("API Request: Mark notification {} as read for user {}", id, userId);
        return ApiResponse.<NotificationResponse>builder()
                .result(notificationService.markAsRead(id, userId))
                .build();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Mark all notifications as read for current user")
    public ApiResponse<Void> markAllAsRead(
            @RequestHeader("X-Auth-User-Id") UUID userId) {
        
        log.info("API Request: Mark all notifications as read for user {}", userId);
        notificationService.markAllAsRead(userId);
        return ApiResponse.<Void>builder().build();
    }
}