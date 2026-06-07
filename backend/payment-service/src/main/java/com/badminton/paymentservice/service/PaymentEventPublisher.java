package com.badminton.paymentservice.service;

import com.badminton.paymentservice.event.PaymentFailedEvent;
import com.badminton.paymentservice.event.PaymentRefundedEvent;
import com.badminton.paymentservice.event.PaymentSucceededEvent;
import com.badminton.paymentservice.event.PayoutApprovedEvent;
import com.badminton.paymentservice.event.PayoutRejectedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventPublisher {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String PAYOUT_TOPIC = "payout-events";

    public void publishPaymentSucceeded(PaymentSucceededEvent event) {
        kafkaTemplate.send("payment-events", event.getBookingId().toString(), event);
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        kafkaTemplate.send("payment-events", event.getBookingId().toString(), event);
    }

    public void publishPaymentRefunded(PaymentRefundedEvent event) {
        kafkaTemplate.send("payment-events", event.getBookingId().toString(), event);
    }

    public void publishPayoutApproved(PayoutApprovedEvent event) {
        kafkaTemplate.send(PAYOUT_TOPIC, event.getPayoutRequestId().toString(), event);
    }

    public void publishPayoutRejected(PayoutRejectedEvent event) {
        kafkaTemplate.send(PAYOUT_TOPIC, event.getPayoutRequestId().toString(), event);
    }
}
