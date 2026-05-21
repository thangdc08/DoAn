package com.badminton.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private String id;
    private UUID receiverId;
    private String type;
    private String title;
    private String content;
    private Map<String, Object> data;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private boolean isRead;
}