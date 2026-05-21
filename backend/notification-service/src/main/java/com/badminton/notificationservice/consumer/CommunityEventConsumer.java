package com.badminton.notificationservice.consumer;

import com.badminton.notificationservice.document.Notification;
import com.badminton.notificationservice.repository.NotificationRepository;
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
            case "RatingCreated":
                handleRatingCreated(event);
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
        
        // Notify the approved user
        notificationRepository.save(Notification.builder()
                .receiverId(userId)
                .type("MATCH_APPROVED")
                .title("Bạn đã được duyệt tham gia kèo")
                .content("Chúc mừng! Bạn đã được duyệt tham gia kèo")
                .data(Map.of("matchPostId", matchPostId, "hostId", hostId))
                .createdAt(LocalDateTime.now())
                .build());
        
        // Notify the host
        notificationRepository.save(Notification.builder()
                .receiverId(hostId)
                .type("MATCH_PARTICIPANT_JOINED")
                .title("Có người mới tham gia kèo")
                .content("Có người mới đã tham gia kèo của bạn")
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
}