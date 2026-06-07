package com.badminton.notificationservice.consumer;

import com.badminton.notificationservice.client.IdentityServiceClient;
import com.badminton.notificationservice.document.Notification;
import com.badminton.notificationservice.repository.NotificationRepository;
import com.badminton.notificationservice.service.AsyncEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentNotificationConsumer {

    private final NotificationRepository notificationRepository;
    private final IdentityServiceClient identityServiceClient;
    private final AsyncEmailService emailService;

    // ──────────────────────────────────────────────
    // Listen for payment-events from payment-service
    // (uses Map<String, Object> deserializer per
    // application.yml config: java.util.HashMap)
    // ──────────────────────────────────────────────
    @KafkaListener(
        topics = "payment-events",
        groupId = "notification-payment-group"
    )
    public void handlePaymentEvent(Map<String, Object> event) {
        log.info("Received payment event: {}", event);
        String eventType = event.get("eventType") != null
            ? event.get("eventType").toString() : null;
        if (eventType == null) {
            log.warn("Received payment event without eventType, ignoring");
            return;
        }
        try {
            switch (eventType) {
                case "PaymentSucceeded" -> handlePaymentSucceeded(event);
                case "PaymentFailed"    -> handlePaymentFailed(event);
                case "PaymentRefunded"  -> handlePaymentRefunded(event);
                default -> log.warn("Unknown payment event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to process payment event type={}", eventType, e);
        }
    }

    // ──────────────────────────────────────────────
    // Listen for payout-events from payment-service
    // (owners get notified when approve/reject)
    // ──────────────────────────────────────────────
    @KafkaListener(
        topics = "payout-events",
        groupId = "notification-payment-group"
    )
    public void handlePayoutEvent(Map<String, Object> event) {
        log.info("Received payout event: {}", event);
        String eventType = event.get("eventType") != null
            ? event.get("eventType").toString() : null;
        if (eventType == null) {
            log.warn("Received payout event without eventType, ignoring");
            return;
        }
        try {
            switch (eventType) {
                case "PayoutApproved" -> handlePayoutApproved(event);
                case "PayoutRejected" -> handlePayoutRejected(event);
                default -> log.warn("Unknown payout event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to process payout event type={}", eventType, e);
        }
    }

    // ──────────────────────────────────────────────
    // PaymentSucceeded: notify owner of incoming payment
    // ──────────────────────────────────────────────
    private void handlePaymentSucceeded(Map<String, Object> event) {
        UUID ownerId = toUuid(event.get("ownerId"));
        UUID bookingId = toUuid(event.get("bookingId"));
        BigDecimal amount = toBigDecimal(event.get("amount"));

        if (ownerId == null) {
            log.debug("No ownerId in PaymentSucceeded event, skipping owner notification");
            return;
        }

        log.info("Processing PaymentSucceeded notification for owner {}", ownerId);

        BigDecimal commission = BigDecimal.ZERO;
        BigDecimal netAmount = amount;
        try {
            commission = amount.multiply(new BigDecimal("0.05"));
            netAmount = amount.subtract(commission);
        } catch (Exception ignored) {}

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", bookingId != null ? bookingId.toString() : null);
        data.put("amount", amount);
        data.put("netAmount", netAmount);
        data.put("paidAt", event.get("paidAt"));

        notificationRepository.save(Notification.builder()
            .receiverId(ownerId)
            .type("PAYMENT_RECEIVED")
            .title("Nhan thanh toan moi")
            .content(String.format(
                "Dat san thanh cong: +%.0f VND (sau phi %.0f VND)",
                netAmount, commission))
            .data(data)
            .createdAt(LocalDateTime.now())
            .build());

        log.info("Notified owner {} about payment received for booking {}", ownerId, bookingId);
    }

    // ──────────────────────────────────────────────
    // PaymentFailed: notify user about failed payment
    // ──────────────────────────────────────────────
    private void handlePaymentFailed(Map<String, Object> event) {
        UUID userId = toUuid(event.get("userId"));
        UUID bookingId = toUuid(event.get("bookingId"));
        String reason = event.get("failureReason") != null
            ? event.get("failureReason").toString() : "UNKNOWN";

        if (userId == null) {
            log.warn("No userId in PaymentFailed event, skipping user notification");
            return;
        }

        log.info("Processing PaymentFailed notification for user {}", userId);

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", bookingId != null ? bookingId.toString() : null);
        data.put("amount", event.get("amount"));
        data.put("reason", reason);
        data.put("failedAt", event.get("failedAt"));

        notificationRepository.save(Notification.builder()
            .receiverId(userId)
            .type("PAYMENT_FAILED")
            .title("Thanh toan that bai")
            .content("Dat san khong thanh cong. Vui long thu lai. Ly do: " + reason)
            .data(data)
            .createdAt(LocalDateTime.now())
            .build());

        log.info("Notified user {} about payment failure for booking {}", userId, bookingId);
    }

    // ──────────────────────────────────────────────
    // PaymentRefunded: notify user about successful refund
    // ──────────────────────────────────────────────
    private void handlePaymentRefunded(Map<String, Object> event) {
        UUID userId = toUuid(event.get("userId"));
        UUID bookingId = toUuid(event.get("bookingId"));
        BigDecimal amount = toBigDecimal(event.get("amount"));

        if (userId == null) {
            log.warn("No userId in PaymentRefunded event, skipping user notification");
            return;
        }

        log.info("Processing PaymentRefunded notification for user {}", userId);

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", bookingId != null ? bookingId.toString() : null);
        data.put("amount", amount);
        data.put("refundedAt", event.get("refundedAt"));

        notificationRepository.save(Notification.builder()
            .receiverId(userId)
            .type("PAYMENT_REFUNDED")
            .title("Hoan tien thanh cong")
            .content(String.format(
                "Da hoan tien %.0f VND cho don dat san cua ban.",
                amount != null ? amount : BigDecimal.ZERO))
            .data(data)
            .createdAt(LocalDateTime.now())
            .build());

        log.info("Notified user {} about refund for booking {}", userId, bookingId);
    }

    // ──────────────────────────────────────────────
    // PayoutApproved: notify owner that payout was approved
    // ──────────────────────────────────────────────
    private void handlePayoutApproved(Map<String, Object> event) {
        UUID ownerId = toUuid(event.get("ownerId"));
        UUID payoutRequestId = toUuid(event.get("payoutRequestId"));
        BigDecimal amount = toBigDecimal(event.get("amount"));
        String bankName = event.get("bankName") != null
            ? event.get("bankName").toString() : "";

        if (ownerId == null) {
            log.warn("No ownerId in PayoutApproved event, skipping notification");
            return;
        }

        log.info("Processing PayoutApproved notification for owner {}", ownerId);

        Map<String, Object> data = new HashMap<>();
        data.put("payoutRequestId", payoutRequestId != null ? payoutRequestId.toString() : null);
        data.put("amount", amount);
        data.put("bankName", bankName);

        notificationRepository.save(Notification.builder()
            .receiverId(ownerId)
            .type("PAYOUT_APPROVED")
            .title("Yeu cau rut tien duoc phe duyet")
            .content(String.format(
                "Yeu cau rut tien %.0f VND da duoc phe duyet. Vui long kiem tra tai khoan %s.",
                amount != null ? amount : BigDecimal.ZERO, bankName))
            .data(data)
            .createdAt(LocalDateTime.now())
            .build());

        log.info("Notified owner {} about payout approval for request {}", ownerId, payoutRequestId);
    }

    // ──────────────────────────────────────────────
    // PayoutRejected: notify owner that payout was rejected
    // ──────────────────────────────────────────────
    private void handlePayoutRejected(Map<String, Object> event) {
        UUID ownerId = toUuid(event.get("ownerId"));
        UUID payoutRequestId = toUuid(event.get("payoutRequestId"));
        BigDecimal amount = toBigDecimal(event.get("amount"));
        String reason = event.get("rejectionReason") != null
            ? event.get("rejectionReason").toString() : "UNKNOWN";

        if (ownerId == null) {
            log.warn("No ownerId in PayoutRejected event, skipping notification");
            return;
        }

        log.info("Processing PayoutRejected notification for owner {}", ownerId);

        Map<String, Object> data = new HashMap<>();
        data.put("payoutRequestId", payoutRequestId != null ? payoutRequestId.toString() : null);
        data.put("amount", amount);
        data.put("reason", reason);

        notificationRepository.save(Notification.builder()
            .receiverId(ownerId)
            .type("PAYOUT_REJECTED")
            .title("Yeu cau rut tien bi tu choi")
            .content(String.format(
                "Yeu cau rut tien %.0f VND bi tu choi. Ly do: %s",
                amount != null ? amount : BigDecimal.ZERO, reason))
            .data(data)
            .createdAt(LocalDateTime.now())
            .build());

        log.info("Notified owner {} about payout rejection for request {}", ownerId, payoutRequestId);
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────
    private static UUID toUuid(Object val) {
        if (val == null) return null;
        try {
            return UUID.fromString(val.toString());
        } catch (Exception e) {
            log.warn("Cannot parse UUID from: {}", val);
            return null;
        }
    }

    private static BigDecimal toBigDecimal(Object val) {
        if (val == null) return null;
        try {
            return new BigDecimal(val.toString());
        } catch (Exception e) {
            log.warn("Cannot parse BigDecimal from: {}", val);
            return null;
        }
    }
}
