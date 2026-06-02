package com.badminton.paymentservice.service;

import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.event.PaymentSucceededEvent;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentEventPublisher eventPublisher;

    @Value("${vnpay.tmn-code:JEZW89WF}")
    private String vnpayTmnCode;

    @Value("${vnpay.hash-secret:EMJVFCWW151QYHZH76Z9H60L2HOX8V2Z}")
    private String vnpayHashSecret;

    @Value("${vnpay.sandbox-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpaySandboxUrl;

    @Value("${vnpay.return-url:http://localhost:8080/payments/api/payments/vnpay/callback}")
    private String vnpayReturnUrl;

    @Value("${vnpay.frontend-url:http://localhost:5173/payment-result}")
    private String vnpayFrontendUrl;

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
            String paymentUrl = buildVnpayUrl(saved, amount);
            saved.setPaymentUrl(paymentUrl);
        } else {
            saved.setPaymentUrl(SANDBOX_WEB_BASE_URL + "/mock-payment?transactionId=" + saved.getId());
        }

        return transactionRepository.save(saved);
    }

    @Transactional
    public boolean processVnpayCallback(Map<String, String> params) {
        String secureHash = params.get("vnp_SecureHash");
        if (secureHash == null || !verifySignature(params, secureHash)) {
            log.error("VNPay signature verification failed or hash is missing.");
            return false;
        }

        String txnRef = params.get("vnp_TxnRef");
        PaymentTransaction transaction = transactionRepository.findById(UUID.fromString(txnRef))
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + txnRef));

        if ("SUCCESS".equals(transaction.getStatus())) {
            log.info("Transaction {} already SUCCESS, skipping duplicate callback", txnRef);
            return true;
        }
        if ("FAILED".equals(transaction.getStatus())) {
            log.warn("Transaction {} already FAILED, ignoring duplicate callback", txnRef);
            return false;
        }

        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            updateSuccessPayment(transaction);
            return true;
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
            return false;
        }
    }

    @Transactional
    public Map<String, String> processVnpayIpn(Map<String, String> params) {
        log.info("Processing VNPay IPN callback: {}", params);
        Map<String, String> response = new HashMap<>();

        String secureHash = params.get("vnp_SecureHash");
        if (secureHash == null || !verifySignature(params, secureHash)) {
            log.error("VNPay IPN signature verification failed.");
            response.put("RspCode", "97");
            response.put("Message", "Invalid signature");
            return response;
        }

        String txnRef = params.get("vnp_TxnRef");
        UUID transactionId;
        try {
            transactionId = UUID.fromString(txnRef);
        } catch (IllegalArgumentException e) {
            log.error("Invalid transaction ID format: {}", txnRef);
            response.put("RspCode", "01");
            response.put("Message", "Order not found");
            return response;
        }

        Optional<PaymentTransaction> optionalTx = transactionRepository.findById(transactionId);
        if (optionalTx.isEmpty()) {
            log.error("Transaction not found: {}", txnRef);
            response.put("RspCode", "01");
            response.put("Message", "Order not found");
            return response;
        }

        PaymentTransaction transaction = optionalTx.get();

        // Verify amount (vnp_Amount is multiplied by 100)
        String vnpAmountStr = params.get("vnp_Amount");
        if (vnpAmountStr == null || vnpAmountStr.isBlank()) {
            response.put("RspCode", "04");
            response.put("Message", "Invalid Amount");
            return response;
        }

        BigDecimal vnpAmount = new BigDecimal(vnpAmountStr).divide(BigDecimal.valueOf(100));
        if (transaction.getAmount().compareTo(vnpAmount) != 0) {
            log.error("Amount mismatch. DB: {}, VNPay: {}", transaction.getAmount(), vnpAmount);
            response.put("RspCode", "04");
            response.put("Message", "Invalid Amount");
            return response;
        }

        // Verify transaction state
        if (!"PENDING".equals(transaction.getStatus())) {
            log.info("Transaction {} already processed. Current status: {}", txnRef, transaction.getStatus());
            response.put("RspCode", "02");
            response.put("Message", "Order already confirmed");
            return response;
        }

        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            updateSuccessPayment(transaction);
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
        }

        response.put("RspCode", "00");
        response.put("Message", "Confirm success");
        return response;
    }

    private boolean verifySignature(Map<String, String> params, String secureHash) {
        Map<String, String> hashParams = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key != null && key.startsWith("vnp_") && !key.equals("vnp_SecureHash") && !key.equals("vnp_SecureHashType")) {
                hashParams.put(key, value);
            }
        }

        String hashData = buildHashParams(hashParams);
        String calculatedHash = hmacSHA512(hashData, vnpayHashSecret);
        return calculatedHash.equalsIgnoreCase(secureHash);
    }

    private String buildHashParams(Map<String, String> hashParams) {
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : hashParams.entrySet()) {
            String value = entry.getValue();
            if (value != null && !value.isBlank()) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                }
                try {
                    hashData.append(entry.getKey())
                            .append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
                } catch (Exception e) {
                    log.error("Failed to encode value: {}", value, e);
                }
            }
        }
        return hashData.toString();
    }

    private void updateSuccessPayment(PaymentTransaction transaction) {
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
        log.info("Payment success callback processed for bookingId: {}", transaction.getBookingId());
    }

    private String buildVnpayUrl(PaymentTransaction transaction, BigDecimal amount) {
        try {
            Map<String, String> params = new TreeMap<>();
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", vnpayTmnCode);
            params.put("vnp_Amount", String.valueOf(amount.multiply(BigDecimal.valueOf(100)).longValue()));
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_TxnRef", transaction.getId().toString());
            params.put("vnp_OrderInfo", "Thanh toan dat san - Booking ID: " + transaction.getBookingId());
            params.put("vnp_OrderType", "other");
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", vnpayReturnUrl);
            params.put("vnp_IpAddr", "127.0.0.1");
            params.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

            String hashData = buildHashParams(params);
            log.info("DEBUG - VNPay hashData: {}", hashData);
            log.info("DEBUG - VNPay TmnCode: {}", vnpayTmnCode);
            log.info("DEBUG - VNPay HashSecret: {}", vnpayHashSecret);
            String secureHash = hmacSHA512(hashData, vnpayHashSecret);

            StringBuilder queryString = new StringBuilder();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                if (queryString.length() > 0) {
                    queryString.append('&');
                }
                queryString.append(encode(entry.getKey()))
                        .append('=')
                        .append(encode(entry.getValue()));
            }

            // Append vnp_SecureHash at the end of the query string
            queryString.append("&vnp_SecureHash=").append(secureHash);

            return vnpaySandboxUrl + "?" + queryString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to build VNPay URL", e);
        }
    }

    private String encode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString()).replaceAll("\\+", "%20");
        } catch (Exception e) {
            return "";
        }
    }

    private String hmacSHA512(String data, String key) {
        try {
            byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
            mac.init(new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA512"));
            byte[] result = mac.doFinal(dataBytes);
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
            updateSuccessPayment(transaction);
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
        }
    }

    public String getVnpayFrontendUrl() {
        return vnpayFrontendUrl;
    }
}
