package com.badminton.notificationservice.consumer;

import com.badminton.notificationservice.client.IdentityServiceClient;
import com.badminton.notificationservice.client.BookingServiceClient;
import com.badminton.notificationservice.client.VenueServiceClient;
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
    private final BookingServiceClient bookingServiceClient;
    private final VenueServiceClient venueServiceClient;

    @KafkaListener(topics = "booking-events", groupId = "notification-group")
    public void handleBookingEvent(Map<String, Object> event) {
        log.info("Received booking event: {}", event);

        UUID bookingId = UUID.fromString(event.get("bookingId").toString());
        String venueName = event.getOrDefault("venueName", "sân").toString();

        // 1. Booking Created (Paid pending confirmation - notifies Owner)
        if (event.containsKey("ownerId") && !event.containsKey("paidAt") && !event.containsKey("reason") && !event.containsKey("confirmedAt")) {
            UUID ownerId = UUID.fromString(event.get("ownerId").toString());
            String amount = event.getOrDefault("totalAmount", "0").toString();

            UUID venueId = bookingServiceClient.getVenueIdForBooking(bookingId);
            boolean isEnabled = true;
            if (venueId != null) {
                isEnabled = venueServiceClient.isNotificationEnabled(venueId, "newBooking");
            }

            if (isEnabled) {
                notificationRepository.save(Notification.builder()
                        .receiverId(ownerId)
                        .type("OWNER_NEW_BOOKING")
                        .title("Có đơn đặt sân mới đang chờ duyệt")
                        .content("Bạn vừa nhận đơn mới tại " + venueName + " (" + amount + "đ) cần phê duyệt.")
                        .data(Map.of("bookingId", bookingId, "venueName", venueName))
                        .createdAt(LocalDateTime.now())
                        .build());
                
                String ownerEmail = identityServiceClient.getUserEmail(ownerId);
                if (ownerEmail != null) {
                    emailService.sendOwnerConfirmationReminderEmail(ownerEmail, venueName, bookingId.toString());
                }
            } else {
                log.info("Owner notification 'newBooking' is disabled for venueId: {} ({})", venueId, venueName);
            }
        }

        // 2. Booking Paid (Triggered on payment - notifies User of payment success)
        if (event.containsKey("paidAt") && !event.containsKey("confirmedAt") && !event.containsKey("ownerId")) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            notificationRepository.save(Notification.builder()
                    .receiverId(userId)
                    .type("BOOKING_PAID")
                    .title("Thanh toán đặt sân thành công")
                    .content("Thanh toán thành công cho đơn đặt sân tại " + venueName + ". Đang chờ chủ sân xác nhận.")
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

        // 3. Booking Confirmed (Notifies User)
        if (event.containsKey("confirmedAt")) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            notificationRepository.save(Notification.builder()
                    .receiverId(userId)
                    .type("BOOKING_CONFIRMED")
                    .title("Đơn đặt sân đã được xác nhận")
                    .content("Đơn đặt sân của bạn tại " + venueName + " đã được chủ sân xác nhận thành công.")
                    .data(Map.of("bookingId", bookingId, "venueName", venueName))
                    .createdAt(LocalDateTime.now())
                    .build());

            String email = identityServiceClient.getUserEmail(userId);
            if (email != null) {
                emailService.sendBookingConfirmedEmail(email, venueName, bookingId.toString());
            }
        }

        // 4. Booking Cancelled by Owner (Notifies User of rejection and refund)
        if (event.containsKey("cancelledAt") && event.containsKey("ownerId")) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            String reason = event.getOrDefault("reason", "Chủ sân từ chối đơn hàng").toString();
            notificationRepository.save(Notification.builder()
                    .receiverId(userId)
                    .type("BOOKING_CANCELLED_BY_OWNER")
                    .title("Đơn đặt sân đã bị hủy bởi chủ sân")
                    .content("Đơn đặt sân tại " + venueName + " bị hủy. Lý do: " + reason + ". Tiền đã được hoàn lại.")
                    .data(Map.of("bookingId", bookingId, "venueName", venueName, "reason", reason))
                    .createdAt(LocalDateTime.now())
                    .build());

            String email = identityServiceClient.getUserEmail(userId);
            if (email != null) {
                emailService.sendBookingCancelledByOwnerEmail(email, venueName, bookingId.toString(), reason);
            }
        }

        // 5. Booking Owner Confirmation Reminder
        if (event.containsKey("ownerId") && event.containsKey("paidAt") && !event.containsKey("userId")) {
            UUID ownerId = UUID.fromString(event.get("ownerId").toString());
            notificationRepository.save(Notification.builder()
                    .receiverId(ownerId)
                    .type("OWNER_CONFIRMATION_REMINDER")
                    .title("Nhắc nhở duyệt đơn đặt sân")
                    .content("Bạn có đơn đặt sân tại " + venueName + " đang chờ duyệt quá hạn. Vui lòng phê duyệt ngay!")
                    .data(Map.of("bookingId", bookingId, "venueName", venueName))
                    .createdAt(LocalDateTime.now())
                    .build());

            String ownerEmail = identityServiceClient.getUserEmail(ownerId);
            if (ownerEmail != null) {
                emailService.sendOwnerConfirmationReminderEmail(ownerEmail, venueName, bookingId.toString());
            }
        }

        // 6. Booking Player Playtime Reminder
        if (event.containsKey("startTime") && !event.containsKey("matchPostId")) {
            UUID userId = UUID.fromString(event.get("userId").toString());
            String startTime = event.get("startTime").toString();
            notificationRepository.save(Notification.builder()
                    .receiverId(userId)
                    .type("PLAYER_PLAYTIME_REMINDER")
                    .title("Nhắc nhở lịch đặt sân sắp diễn ra")
                    .content("Lịch chơi của bạn tại " + venueName + " sắp diễn ra lúc: " + startTime + ".")
                    .data(Map.of("bookingId", bookingId, "venueName", venueName, "startTime", startTime))
                    .createdAt(LocalDateTime.now())
                    .build());

            String email = identityServiceClient.getUserEmail(userId);
            if (email != null) {
                emailService.sendPlayerPlaytimeReminderEmail(email, venueName, bookingId.toString(), startTime);
            }
        }
    }
}
