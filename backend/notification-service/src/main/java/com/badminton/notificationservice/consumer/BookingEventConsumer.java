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
public class BookingEventConsumer {

    private final NotificationRepository notificationRepository;
    private final IdentityServiceClient identityServiceClient;
    private final AsyncEmailService emailService;

    @KafkaListener(topics = "booking-events", groupId = "notification-group")
    public void handleBookingEvent(Map<String, Object> event) {
        log.info("Received booking event: {}", event);

        UUID bookingId = UUID.fromString(event.get("bookingId").toString());
        String venueName = event.getOrDefault("venueName", "san").toString();

        if (event.containsKey("ownerId")) {
            UUID ownerId = UUID.fromString(event.get("ownerId").toString());
            String amount = event.getOrDefault("totalAmount", "0").toString();
            notificationRepository.save(Notification.builder()
                    .receiverId(ownerId)
                    .type("OWNER_NEW_BOOKING")
                    .title("Co don dat san moi")
                    .content("Ban vua nhan don moi tai " + venueName + " (" + amount + "d)")
                    .data(Map.of("bookingId", bookingId, "venueName", venueName))
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        if (event.containsKey("paidAt")) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            notificationRepository.save(Notification.builder()
                    .receiverId(userId)
                    .type("BOOKING_PAID")
                    .title("Dat san thanh cong")
                    .content("Ban da dat san thanh cong tai " + venueName)
                    .data(Map.of("bookingId", bookingId, "venueName", venueName))
                    .createdAt(LocalDateTime.now())
                    .build());

            String email = identityServiceClient.getUserEmail(userId);
            if (email != null) {
                emailService.sendBookingPaidEmail(email, venueName, bookingId.toString());
            } else {
                log.warn("Cannot send email notification: user email not found for userId: {}", userId);
            }
        }
    }
}
