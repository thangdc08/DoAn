package com.badminton.notificationservice.service;

import com.badminton.notificationservice.document.Notification;
import com.badminton.notificationservice.dto.NotificationResponse;
import com.badminton.notificationservice.dto.UnreadCountResponse;
import com.badminton.notificationservice.repository.NotificationRepository;
import com.badminton.common.exception.AppException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;

  public Page<NotificationResponse> getMyNotifications(UUID userId, Pageable pageable) {
    log.info("Getting notifications for user: {}", userId);

    List<Notification> notifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);

    // Manual pagination since MongoDB repository doesn't support Pageable directly
    // in this case
    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), notifications.size());

    List<NotificationResponse> pageContent = notifications.subList(start, end)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());

    return new PageImpl<>(pageContent, pageable, notifications.size());
  }

  public UnreadCountResponse getUnreadCount(UUID userId) {
    log.info("Getting unread count for user: {}", userId);
    long count = notificationRepository.countByReceiverIdAndReadAtIsNull(userId);
    return UnreadCountResponse.builder().unreadCount(count).build();
  }

  public NotificationResponse markAsRead(String notificationId, UUID userId) {
    log.info("Marking notification {} as read for user {}", notificationId, userId);

    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Notification not found"));

    if (!notification.getReceiverId().equals(userId)) {
      throw new AppException(HttpStatus.FORBIDDEN, "You can only mark your own notifications as read");
    }

    if (notification.getReadAt() == null) {
      notification.setReadAt(LocalDateTime.now());
      notification = notificationRepository.save(notification);
      log.info("Notification {} marked as read", notificationId);
    }

    return toResponse(notification);
  }

  public void markAllAsRead(UUID userId) {
    log.info("Marking all notifications as read for user: {}", userId);

    List<Notification> unreadNotifications = notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId)
        .stream()
        .filter(n -> n.getReadAt() == null)
        .collect(Collectors.toList());

    LocalDateTime now = LocalDateTime.now();
    unreadNotifications.forEach(notification -> notification.setReadAt(now));

    notificationRepository.saveAll(unreadNotifications);
    log.info("Marked {} notifications as read for user {}", unreadNotifications.size(), userId);
  }

  private NotificationResponse toResponse(Notification notification) {
    return NotificationResponse.builder()
        .id(notification.getId())
        .receiverId(notification.getReceiverId())
        .type(notification.getType())
        .title(notification.getTitle())
        .content(notification.getContent())
        .data(notification.getData())
        .readAt(notification.getReadAt())
        .createdAt(notification.getCreatedAt())
        .isRead(notification.getReadAt() != null)
        .build();
  }
}