package com.badminton.paymentservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class MockPaymentCallbackRequest {
    private UUID transactionId;
    private boolean success;
}
