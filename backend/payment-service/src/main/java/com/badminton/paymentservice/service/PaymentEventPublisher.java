package com.badminton.paymentservice.service;

import com.badminton.paymentservice.event.PaymentSucceededEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentEventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "payment-events";

    public void publishPaymentSucceeded(PaymentSucceededEvent event) {
        kafkaTemplate.send(TOPIC, event.getBookingId().toString(), event);
    }
}
