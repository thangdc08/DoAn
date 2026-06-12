package com.badminton.notificationservice.consumer;

import com.badminton.notificationservice.client.IdentityServiceClient;
import com.badminton.notificationservice.document.Notification;
import com.badminton.notificationservice.repository.NotificationRepository;
import com.badminton.notificationservice.service.AsyncEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityEventConsumer {

    private final NotificationRepository notificationRepository;
    private final IdentityServiceClient identityServiceClient;
    private final AsyncEmailService emailService;

    @KafkaListener(topics = "community.events", groupId = "notification-group")
    public void handleCommunityEvent(Map<String, Object> event) {
        log.info("Received community event: {}", event);
        
        String eventType = event.get("eventType").toString();
        
        switch (eventType) {
            case "MatchPostCreated":
                handleMatchPostCreated(event);
                break;
            case "MatchJoinRequested":
                handleMatchJoinRequested(event);
                break;
            case "MatchApproved":
                handleMatchApproved(event);
                break;
            case "MatchRejected":
                handleMatchRejected(event);
                break;
            case "RatingCreated":
                handleRatingCreated(event);
                break;
            case "MatchPlaytimeReminder":
                handleMatchPlaytimeReminder(event);
                break;
            default:
                log.warn("Unknown community event type: {}", eventType);
        }
    }

    private void handleMatchPostCreated(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        UUID hostId = UUID.fromString(event.get("hostId").toString());
        String title = event.get("title").toString();
        
        notificationRepository.save(Notification.builder()
                .receiverId(hostId)
                .type("MATCH_POST_CREATED")
                .title("Kèo đã được tạo thành công")
                .content("Kèo '" + title + "' của bạn đã được tạo thành công")
                .data(Map.of("matchPostId", matchPostId, "title", title))
                .createdAt(LocalDateTime.now())
                .build());
        
        log.info("Created notification for match post creation: {}", matchPostId);
    }

    private void handleMatchJoinRequested(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        UUID userId = UUID.fromString(event.get("userId").toString());
        UUID hostId = UUID.fromString(event.get("hostId").toString());
        
        notificationRepository.save(Notification.builder()
                .receiverId(hostId)
                .type("MATCH_JOIN_REQUESTED")
                .title("Có người muốn tham gia kèo")
                .content("Có người muốn tham gia kèo của bạn, hãy xem xét duyệt")
                .data(Map.of("matchPostId", matchPostId, "userId", userId))
                .createdAt(LocalDateTime.now())
                .build());
        
        log.info("Created notification for match join request: match={}, user={}", matchPostId, userId);
    }

    private void handleMatchApproved(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        UUID userId = UUID.fromString(event.get("userId").toString());
        UUID hostId = UUID.fromString(event.get("hostId").toString());
        String title = event.get("title") != null ? event.get("title").toString() : "Kèo giao lưu";

        // Notify the approved user
        notificationRepository.save(Notification.builder()
                .receiverId(userId)
                .type("MATCH_APPROVED")
                .title("Bạn đã được duyệt tham gia kèo")
                .content("Chúc mừng! Chủ kèo đã xác nhận bạn tham gia kèo '" + title + "' thành công!")
                .data(Map.of("matchPostId", matchPostId, "hostId", hostId))
                .createdAt(LocalDateTime.now())
                .build());

        // Notify the host
        notificationRepository.save(Notification.builder()
                .receiverId(hostId)
                .type("MATCH_PARTICIPANT_JOINED")
                .title("Có người mới tham gia kèo")
                .content("Một người chơi đã được xác nhận tham gia kèo '" + title + "' của bạn")
                .data(Map.of("matchPostId", matchPostId, "userId", userId))
                .createdAt(LocalDateTime.now())
                .build());

        log.info("Created notifications for match approval: match={}, user={}", matchPostId, userId);
    }

    private void handleRatingCreated(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        UUID raterId = UUID.fromString(event.get("raterId").toString());
        UUID rateeUserId = UUID.fromString(event.get("rateeUserId").toString());
        Integer stars = Integer.valueOf(event.get("stars").toString());
        
        notificationRepository.save(Notification.builder()
                .receiverId(rateeUserId)
                .type("PLAYER_RATED")
                .title("Bạn đã được đánh giá")
                .content("Bạn đã nhận được đánh giá " + stars + " sao từ trận đấu")
                .data(Map.of("matchPostId", matchPostId, "raterId", raterId, "stars", stars))
                .createdAt(LocalDateTime.now())
                .build());
        
        log.info("Created notification for player rating: ratee={}, stars={}", rateeUserId, stars);
    }

    private void handleMatchRejected(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        UUID userId = UUID.fromString(event.get("userId").toString());
        UUID hostId = UUID.fromString(event.get("hostId").toString());
        String title = event.get("title") != null ? event.get("title").toString() : "Kèo giao lưu";

        // Notify the rejected user
        notificationRepository.save(Notification.builder()
                .receiverId(userId)
                .type("MATCH_REJECTED")
                .title("Yêu cầu tham gia kèo bị từ chối")
                .content("Rất tiếc! Yêu cầu tham gia kèo '" + title + "' của bạn đã bị từ chối.")
                .data(Map.of("matchPostId", matchPostId, "hostId", hostId))
                .createdAt(LocalDateTime.now())
                .build());

        log.info("Created notification for match rejection: match={}, user={}", matchPostId, userId);
    }

    private void handleMatchPlaytimeReminder(Map<String, Object> event) {
        UUID matchPostId = UUID.fromString(event.get("matchPostId").toString());
        String title = event.get("title").toString();
        String startTime = event.get("startTime").toString();
        String venueName = event.getOrDefault("venueName", "Sân đấu giao lưu").toString();
        
        @SuppressWarnings("unchecked")
        java.util.List<String> userIdStrings = (java.util.List<String>) event.get("userIds");
        if (userIdStrings != null) {
            for (String userIdStr : userIdStrings) {
                UUID userId = UUID.fromString(userIdStr);
                
                // Save in-app notification
                notificationRepository.save(Notification.builder()
                        .receiverId(userId)
                        .type("MATCH_PLAYTIME_REMINDER")
                        .title("Kèo đấu sắp diễn ra")
                        .content("Nhắc nhở: Kèo '" + title + "' của bạn sắp diễn ra lúc: " + startTime + " tại " + venueName + ".")
                        .data(Map.of("matchPostId", matchPostId, "title", title, "startTime", startTime))
                        .createdAt(LocalDateTime.now())
                        .build());
                
                // Send email
                try {
                    String email = identityServiceClient.getUserEmail(userId);
                    if (email != null) {
                        emailService.sendMatchPlaytimeReminderEmail(email, title, startTime, venueName);
                    }
                } catch (Exception e) {
                    log.error("Failed to send match playtime reminder email to userId: {}", userId, e);
                }
            }
        }
    }
}