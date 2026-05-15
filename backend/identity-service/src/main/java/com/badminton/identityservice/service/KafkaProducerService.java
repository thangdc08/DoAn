package com.badminton.identityservice.service;

import com.badminton.common.dto.event.OnboardingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "partner-onboarding";

    public void sendOnboardingEvent(OnboardingEvent event) {
        log.info("Sending onboarding event to Kafka: {}", event);
        kafkaTemplate.send(TOPIC, event);
    }
}
