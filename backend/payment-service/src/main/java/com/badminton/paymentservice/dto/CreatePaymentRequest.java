package com.badminton.paymentservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreatePaymentRequest {
    private UUID bookingId;
    private UUID userId;
    private BigDecimal amount;
    private String provider;
}
