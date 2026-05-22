package com.badminton.paymentservice.service;

import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.event.PaymentSucceededEvent;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentEventPublisher eventPublisher;

    @Value("${vnpay.tmn-code:}")
    private String vnpayTmnCode;

    @Value("${vnpay.hash-secret:}")
    private String vnpayHashSecret;

    @Value("${vnpay.sandbox-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpaySandboxUrl;

    @Value("${vnpay.return-url:http://localhost:5173/payment-result}")
    private String vnpayReturnUrl;

    private static final String SANDBOX_WEB_BASE_URL = "http://localhost:5173";

    @Transactional
    public PaymentTransaction createPayment(UUID bookingId, UUID userId, BigDecimal amount, String provider) {
        String selectedProvider = (provider == null || provider.isBlank()) ? "MOCK" : provider.toUpperCase();
        PaymentTransaction transaction = PaymentTransaction.builder()
                .bookingId(bookingId)
                .userId(userId)
                .amount(amount)
                .amountVnd(amount)
                .provider(selectedProvider)
                .status("PENDING")
                .build();

        PaymentTransaction saved = transactionRepository.save(transaction);

        if ("VNPAY".equals(selectedProvider)) {
            // Build VNPay sandbox URL
            String paymentUrl = buildVnpayUrl(saved, amount);
            saved.setPaymentUrl(paymentUrl);
        } else {
            // Mock payment - redirect to internal mock page
            saved.setPaymentUrl(SANDBOX_WEB_BASE_URL + "/mock-payment?transactionId=" + saved.getId());
        }

        return transactionRepository.save(saved);
    }

    private String buildVnpayUrl(PaymentTransaction transaction, BigDecimal amount) {
        try {
            Map<String, String> params = new TreeMap<>();

            // Required VNPay parameters
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnpayTmnCode);
            params.put("vnp_Amount", amount.multiply(BigDecimal.valueOf(100)).toPlainString()); // VNPay uses smallest unit
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef", transaction.getId().toString());
            params.put("vnp_OrderInfo", "Thanh toan dat san - Booking ID: " + transaction.getBookingId());
            params.put("vnp_OrderType", "other");
            params.put("vnp_Locale", "vi");
            params.put("vnp_ReturnUrl", vnpayReturnUrl);
            params.put("vnp_IpAddr", "127.0.0.1"); // Should get from request in production
            params.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

            // Generate secure hash
            String hashData = buildHashData(params);
            String secureHash = hmacSHA512(hashData, vnpayHashSecret);
            params.put("vnp_SecureHash", secureHash);

            // Build query string
            StringBuilder queryString = new StringBuilder();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                if (queryString.length() > 0) {
                    queryString.append('&');
                }
                queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
            }

            return vnpaySandboxUrl + "?" + queryString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to build VNPay URL", e);
        }
    }

    private String buildHashData(Map<String, String> params) {
        StringBuilder hashData = new StringBuilder();
        // VNPay requires specific order: vnp_ExpireDate, vnp_IpAddr, ... Actually we follow the manual
        // According to VNPay docs, the hash data string is built by concatenating parameter names and values in alphabetical order,
        // separated by '&', without URL encoding at this stage.
        // But we already have TreeMap (sorted alphabetically). We need to build: key1=value1&key2=value2...
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (hashData.length() > 0) {
                hashData.append('&');
            }
            hashData.append(entry.getKey()).append('=').append(entry.getValue());
        }
        return hashData.toString();
    }

    private String hmacSHA512(String data, String key) {
        try {
            MessageDigest md = MessageDigest.getInstance("HmacSHA512");
            byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            mac.init(new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA512"));
            byte[] result = mac.doFinal(dataBytes);
            // Convert to hex
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC SHA512", e);
        }
    }

    @Transactional
    public void processMockCallback(UUID transactionId, boolean success) {
        PaymentTransaction transaction = transactionRepository.findById(transactionId).orElseThrow();

        if (success) {
            transaction.setStatus("SUCCESS");
            transaction.setPaidAt(LocalDateTime.now());
            transactionRepository.save(transaction);

            eventPublisher.publishPaymentSucceeded(PaymentSucceededEvent.builder()
                    .eventId(UUID.randomUUID())
                    .eventType("PaymentSucceeded")
                    .bookingId(transaction.getBookingId())
                    .transactionId(transaction.getId())
                    .userId(transaction.getUserId())
                    .amount(transaction.getAmount())
                    .paidAt(transaction.getPaidAt())
                    .build());
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
        }
    }
}
