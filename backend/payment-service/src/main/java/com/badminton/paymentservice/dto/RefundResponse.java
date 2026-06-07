package com.badminton.paymentservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class RefundResponse {
    private String status;
    private UUID bookingId;
    private UUID transactionId;
    private BigDecimal amount;
    private BigDecimal netAmount;
    private String message;
}
