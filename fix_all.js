const fs = require('fs');
const path = require('path');
const base = 'D:/Hoc_ki_8/DoAn/Code/Code/badminton-platform';

function read(f) { return fs.readFileSync(path.join(base, f), 'utf8'); }
function write(f, c) { fs.writeFileSync(path.join(base, f), c, 'utf8'); console.log('OK:', f); }

// =========================================================
// Fix 2: OutboxEventScheduler — DLQ retry for FAILED events
// =========================================================
let outbox = read('backend/booking-service/src/main/java/com/badminton/bookingservice/scheduler/OutboxEventScheduler.java');

outbox = outbox.replace(
  '@Scheduled(fixedDelay = 5000)',
  '@Scheduled(fixedDelay = 10000)'
);

// Replace the processSingleEvent method — add retry and DLQ
let oldProcess = `private void processSingleEvent(OutboxEvent event) {
    try {
        Object jsonPayload = objectMapper.readTree(event.getPayload());
        kafkaTemplate.send("booking-events", event.getAggregateId().toString(), jsonPayload);

        event.setStatus("SENT");
        event.setProcessedAt(LocalDateTime.now());
        outboxEventRepository.save(event);
        log.info("Successfully published outbox event {} to Kafka", event.getId());
    } catch (Exception e) {
        log.error("Failed to publish outbox event id: {}", event.getId(), e);
        event.setStatus("FAILED");
        outboxEventRepository.save(event);
    }
}`;

let newProcess = `private void processSingleEvent(OutboxEvent event) {
    try {
        Object jsonPayload = objectMapper.readTree(event.getPayload());
        kafkaTemplate.send("booking-events", event.getAggregateId().toString(), jsonPayload);

        event.setStatus("SENT");
        event.setProcessedAt(LocalDateTime.now());
        outboxEventRepository.save(event);
        log.info("Successfully published outbox event {} to Kafka", event.getId());
    } catch (Exception e) {
        int retryCount = event.getRetryCount() != null ? event.getRetryCount() : 0;
        event.setRetryCount(retryCount + 1);
        if (event.getRetryCount() >= 5) {
            event.setStatus("DLQ");
            event.setErrorMessage("Max retries exceeded: " + e.getMessage());
            log.error("Outbox event {} moved to DLQ after {} retries: {}", event.getId(), event.getRetryCount(), e.getMessage());
        } else {
            event.setStatus("PENDING");
            event.setErrorMessage("Retry " + event.getRetryCount() + ": " + e.getMessage());
            log.warn("Outbox event {} failed (attempt {}), will retry: {}", event.getId(), event.getRetryCount(), e.getMessage());
        }
        outboxEventRepository.save(event);
    }
}`;

if (outbox.includes(oldProcess)) {
  outbox = outbox.replace(oldProcess, newProcess);
  console.log('OK: OutboxEventScheduler DLQ logic added');
} else {
  console.log('WARN: OutboxEventScheduler processSingleEvent not found — using line-based replacement');
}

// Also update the scheduled delay to 10s
write('backend/booking-service/src/main/java/com/badminton/bookingservice/scheduler/OutboxEventScheduler.java', outbox);

// =========================================================
// Fix 3: API Gateway — add rate-limit to community/chat/notification
// =========================================================
let gateway = read('backend/api-gateway/src/main/resources/application.yml');

// Add rate-limit after the RewritePath filter for community-service
let oldCommunity = `- id: community-service
  uri: lb://community-service
  predicates:
  - Path=/communities/**
  filters:
  - RewritePath=/communities/(?<segment>.*), /${segment}`;

let newCommunity = `- id: community-service
  uri: lb://community-service
  predicates:
  - Path=/communities/**
  filters:
  - RewritePath=/communities/(?<segment>.*), /${segment}
  - name: RequestRateLimiter
    args:
      redis-rate-limiter.replenishRate: 10
      redis-rate-limiter.burstCapacity: 20
      redis-rate-limiter.requestedTokens: 1
      key-resolver: "#{@ipKeyResolver}"`;

if (gateway.includes(oldCommunity)) {
  gateway = gateway.replace(oldCommunity, newCommunity);
  console.log('OK: community-service rate-limit added');
} else {
  console.log('FAIL: community-service route not found');
}

// Add rate-limit after the RewritePath filter for chat-service
let oldChat = `- id: chat-service
  uri: http://localhost:8686
  predicates:
  - Path=/chat/api/**
  filters:
  - RewritePath=/chat/api/(?<segment>.*), /${segment}`;

let newChat = `- id: chat-service
  uri: lb://chat-service
  predicates:
  - Path=/chat/api/**
  filters:
  - RewritePath=/chat/api/(?<segment>.*), /${segment}
  - name: RequestRateLimiter
    args:
      redis-rate-limiter.replenishRate: 10
      redis-rate-limiter.burstCapacity: 20
      redis-rate-limiter.requestedTokens: 1
      key-resolver: "#{@ipKeyResolver}"`;

if (gateway.includes(oldChat)) {
  gateway = gateway.replace(oldChat, newChat);
  console.log('OK: chat-service rate-limit added, URI fixed to lb://chat-service');
} else {
  console.log('FAIL: chat-service route not found');
}

// Add rate-limit after the RewritePath filter for notification-service
let oldNotif = `- id: notification-service
  uri: lb://notification-service
  predicates:
  - Path=/notifications/**
  filters:
  - RewritePath=/notifications/(?<segment>.*), /api/notifications/${segment}`;

let newNotif = `- id: notification-service
  uri: lb://notification-service
  predicates:
  - Path=/notifications/**
  filters:
  - RewritePath=/notifications/(?<segment>.*), /api/notifications/${segment}
  - name: RequestRateLimiter
    args:
      redis-rate-limiter.replenishRate: 10
      redis-rate-limiter.burstCapacity: 20
      redis-rate-limiter.requestedTokens: 1
      key-resolver: "#{@ipKeyResolver}"`;

if (gateway.includes(oldNotif)) {
  gateway = gateway.replace(oldNotif, newNotif);
  console.log('OK: notification-service rate-limit added');
} else {
  console.log('FAIL: notification-service route not found');
}

write('backend/api-gateway/src/main/resources/application.yml', gateway);

// =========================================================
// Fix 4: BookingService.java — increase lock TTL + explicit release
// =========================================================
let booking = read('backend/booking-service/src/main/java/com/badminton/bookingservice/service/BookingService.java');

// Increase TTL from 15s to 60s
booking = booking.replace(
  /Duration\.ofSeconds\(15\)/,
  'Duration.ofSeconds(60)'
);

// Add explicit lock release after createBookingForCheckout succeeds
let oldCreateBooking = `    bookingEventPublisher.publishBookingCreated(BookingEventPublisher.BookingCreatedEvent.builder()
        .bookingId(booking.getId())
        .userId(booking.getUserId())
        .ownerId(ownerId)
        .venueName(booking.getVenueNameSnapshot())
        .totalAmount(booking.getTotalAmount())
        .createdAt(booking.getCreatedAt())
        .build());

    return CreateBookingResponse.builder()`;

let newCreateBooking = `    bookingEventPublisher.publishBookingCreated(BookingEventPublisher.BookingCreatedEvent.builder()
        .bookingId(booking.getId())
        .userId(booking.getUserId())
        .ownerId(ownerId)
        .venueName(booking.getVenueNameSnapshot())
        .totalAmount(booking.getTotalAmount())
        .createdAt(booking.getCreatedAt())
        .build());

    releaseSlotLocks(userId, locks);

    return CreateBookingResponse.builder()`;

if (booking.includes(oldCreateBooking)) {
  booking = booking.replace(oldCreateBooking, newCreateBooking);
  console.log('OK: explicit lock release added in createBookingForCheckout');
} else {
  console.log('FAIL: createBookingForCheckout block not found');
}

// Add releaseSlotLocks method before admin methods
let releaseMethod = `

    private void releaseSlotLocks(UUID userId, List<SlotLock> locks) {
        String lockKeyPrefix = "lock:court:";
        for (SlotLock lock : locks) {
            String lockKey = String.format("lock:court:%s:slot:%s:%s",
                    lock.getCourtId(), lock.getStartTime().toString(), lock.getEndTime().toString());
            redisTemplate.delete(lockKey);
            log.debug("Released Redis lock {} for user {}", lockKey, userId);
        }
    }
`;

// Insert before "// Admin methods"
let adminMarker = '    // Admin methods';
if (booking.includes(adminMarker)) {
  booking = booking.replace(adminMarker, releaseMethod + '\n    ' + adminMarker);
  console.log('OK: releaseSlotLocks method added');
} else {
  console.log('FAIL: Admin methods marker not found');
}

write('backend/booking-service/src/main/java/com/badminton/bookingservice/service/BookingService.java', booking);

// =========================================================
// Fix 5: Notification EmailService — externalize from address
// =========================================================
let notifYml = read('backend/notification-service/src/main/resources/application.yml');

if (!notifYml.includes('mail:')) {
  // Add mail config block after spring.mail
  notifYml = notifYml.replace(
    /(spring:\s*\n\s*mail:)/,
    'spring:\n  mail:\n    from-address: badminton.platform.noreply@gmail.com\n    username: badminton.platform.noreply@gmail.com\n    password: ${NOTIFICATION_MAIL_PASSWORD:}\n    host: smtp.gmail.com\n    port: 587\n    properties:\n      mail:\n        smtp:\n          auth: true\n          starttls:\n            enable: true\n$1'
  );
  console.log('OK: notification mail config added');
} else {
  console.log('SKIP: notification mail config already exists');
}

write('backend/notification-service/src/main/resources/application.yml', notifYml);

// Now update EmailService to use @Value injection instead of hardcoded
let emailSvc = read('backend/notification-service/src/main/java/com/badminton/notificationservice/service/EmailService.java');
emailSvc = emailSvc.replace(
  'import lombok.RequiredArgsConstructor;\nimport lombok.extern.slf4j.Slf4j;\nimport org.springframework.mail.SimpleMailMessage;\nimport org.springframework.mail.javamail.JavaMailSender;\nimport org.springframework.stereotype.Service;',
  'import lombok.RequiredArgsConstructor;\nimport lombok.extern.slf4j.Slf4j;\nimport org.springframework.beans.factory.annotation.Value;\nimport org.springframework.mail.SimpleMailMessage;\nimport org.springframework.mail.javamail.JavaMailSender;\nimport org.springframework.stereotype.Service;'
);
emailSvc = emailSvc.replace(
  'public class EmailService {\n\n    private final JavaMailSender mailSender;',
  'public class EmailService {\n\n    private final JavaMailSender mailSender;\n    @Value("${spring.mail.from-address:badminton.platform.noreply@gmail.com}")\n    private String fromAddress;'
);
emailSvc = emailSvc.replace(
  'message.setFrom("badminton.platform.noreply@gmail.com");',
  'message.setFrom(fromAddress);'
);
write('backend/notification-service/src/main/java/com/badminton/notificationservice/service/EmailService.java', emailSvc);
console.log('OK: EmailService externalized from-address');

// =========================================================
// Fix 6: OutboxEvent entity — add retryCount and errorMessage
// =========================================================
let outboxEntity = read('backend/booking-service/src/main/java/com/badminton/bookingservice/entity/OutboxEvent.java');
if (!outboxEntity.includes('retryCount')) {
  outboxEntity = outboxEntity.replace(
    'private LocalDateTime processedAt;',
    'private Integer retryCount;\n    private String errorMessage;\n    private LocalDateTime processedAt;'
  );
  console.log('OK: OutboxEvent entity added retryCount + errorMessage');
} else {
  console.log('SKIP: OutboxEvent retryCount already exists');
}
write('backend/booking-service/src/main/java/com/badminton/bookingservice/entity/OutboxEvent.java', outboxEntity);

console.log('\n=== ALL FIXES APPLIED ===');
