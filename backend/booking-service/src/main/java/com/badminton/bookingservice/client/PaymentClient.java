package com.badminton.bookingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;
import java.util.UUID;

@FeignClient(name = "payment-service", url = "${app.services.payment-service.url:http://localhost:8084}")
public interface PaymentClient {

    @PostMapping("/api/payments/refund/{bookingId}")
    Map<String, Object> refundPayment(@PathVariable("bookingId") UUID bookingId);
}
