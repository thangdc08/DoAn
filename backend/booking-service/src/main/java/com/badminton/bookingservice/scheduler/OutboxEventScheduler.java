package com.badminton.bookingservice.scheduler;

import com.badminton.bookingservice.entity.OutboxEvent;
import com.badminton.bookingservice.repository.OutboxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxEventScheduler {

private final OutboxEventRepository outboxEventRepository;
private final KafkaTemplate<String, Object> kafkaTemplate;
private final ObjectMapper objectMapper;
private static final int MAX_RETRIES = 5;

@Scheduled(fixedDelay = 10000) // Chạy sau mỗi 10 giây
@Transactional
public void processOutboxEvents() {
List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatusOrderByCreatedAtAsc("PENDING");
if (pendingEvents.isEmpty()) {
return;
}

log.info("Processing {} pending outbox events", pendingEvents.size());
for (OutboxEvent event : pendingEvents) {
processSingleEvent(event);
}
}

private void processSingleEvent(OutboxEvent event) {
try {
Object jsonPayload = objectMapper.readTree(event.getPayload());
kafkaTemplate.send("booking-events", event.getAggregateId().toString(), jsonPayload);

event.setStatus("SENT");
event.setProcessedAt(LocalDateTime.now());
event.setRetryCount(0);
event.setErrorMessage(null);
outboxEventRepository.save(event);
log.info("Successfully published outbox event {} to Kafka", event.getId());
} catch (Exception e) {
int retryCount = event.getRetryCount() != null ? event.getRetryCount() : 0;
retryCount++;
event.setRetryCount(retryCount);
if (retryCount >= MAX_RETRIES) {
event.setStatus("DLQ");
event.setErrorMessage("Max retries (" + MAX_RETRIES + ") exceeded: " + e.getMessage());
log.error("Outbox event {} moved to DLQ after {} retries: {}", event.getId(), retryCount, e.getMessage());
} else {
event.setStatus("PENDING");
event.setErrorMessage("Retry " + retryCount + "/" + MAX_RETRIES + ": " + e.getMessage());
log.warn("Outbox event {} failed (attempt {}/{}), will retry: {}", event.getId(), retryCount, MAX_RETRIES, e.getMessage());
}
outboxEventRepository.save(event);
}
}
}