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
public class PaymentEventConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "payment-events", groupId = "notification-group")
    public void handlePaymentSucceeded(Map<String, Object> event) {
        log.info("Received payment event: {}", event);
        
        UUID userId = UUID.fromString(event.get("userId").toString());
        UUID bookingId = UUID.fromString(event.get("bookingId").toString());

        Notification notification = Notification.builder()
                .receiverId(userId)
                .type("BOOKING_PAID")
                .title("Đặt sân thành công")
                .content("Đơn đặt sân của bạn đã được thanh toán thành công.")
                .data(Map.of("bookingId", bookingId))
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }
}
