package com.badminton.paymentservice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CreatePaymentResponse {
    private UUID transactionId;
    private UUID bookingId;
    private BigDecimal amount;
    private String provider;
    private String status;
    private String paymentUrl;
}
