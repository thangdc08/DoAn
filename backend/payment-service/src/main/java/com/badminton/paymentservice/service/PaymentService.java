package com.badminton.paymentservice.service;

import com.badminton.paymentservice.entity.OwnerWallet;
import com.badminton.paymentservice.entity.PaymentCallback;
import com.badminton.paymentservice.entity.PaymentTransaction;
import com.badminton.paymentservice.entity.PayoutRequest;
import com.badminton.paymentservice.entity.SystemConfig;
import com.badminton.paymentservice.entity.WalletTransaction;
import com.badminton.paymentservice.event.PaymentFailedEvent;
import com.badminton.paymentservice.event.PaymentRefundedEvent;
import com.badminton.paymentservice.event.PaymentSucceededEvent;
import com.badminton.paymentservice.repository.OwnerWalletRepository;
import com.badminton.paymentservice.repository.PaymentCallbackRepository;
import com.badminton.paymentservice.repository.PaymentTransactionRepository;
import com.badminton.paymentservice.repository.PayoutRequestRepository;
import com.badminton.paymentservice.repository.SystemConfigRepository;
import com.badminton.paymentservice.repository.WalletTransactionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

 private final PaymentTransactionRepository transactionRepository;
 private final PaymentEventPublisher eventPublisher;
 private final OwnerWalletRepository walletRepository;
 private final PaymentCallbackRepository callbackRepository;
 private final SystemConfigRepository systemConfigRepository;
 private final WalletTransactionRepository walletTxRepository;
 private final ObjectMapper objectMapper;

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

 // Commission rate: read from DB, fallback 5%
 private BigDecimal getCommissionRate() {
  try {
   Optional<SystemConfig> cfg = systemConfigRepository.findByConfigKey("commission_rate");
   if (cfg.isPresent() && cfg.get().getConfigValue() != null) {
    return new BigDecimal(cfg.get().getConfigValue());
   }
  } catch (Exception e) {
   log.warn("Failed to read commission_rate from config, falling back to 0.05", e);
  }
  return BigDecimal.valueOf(0.05);
 }

 private void recordWalletTx(UUID ownerId, BigDecimal amount, String type, String description,
  UUID relatedTxId, BigDecimal before, BigDecimal after) {
  try {
   walletTxRepository.save(WalletTransaction.builder()
    .ownerId(ownerId)
    .amount(amount)
    .type(type)
    .status("SUCCESS")
    .description(description)
    .relatedTransactionId(relatedTxId)
    .balanceBefore(before)
    .balanceAfter(after)
    .build());
  } catch (Exception e) {
   log.warn("Failed to record wallet transaction audit", e);
  }
 }

 // Create payment
 @Transactional
 public PaymentTransaction createPayment(UUID bookingId, UUID userId, BigDecimal amount,
  String provider, UUID venueId, UUID ownerId) {
  String selectedProvider = (provider == null || provider.isBlank()) ? "MOCK" : provider.toUpperCase();
  if (ownerId == null) {
   throw new IllegalArgumentException("ownerId is required when creating payment — ownerId=" + ownerId);
  }
  PaymentTransaction transaction = PaymentTransaction.builder()
   .bookingId(bookingId)
   .userId(userId)
   .amount(amount)
   .amountVnd(amount)
   .provider(selectedProvider)
   .status("PENDING")
   .venueId(venueId)
   .ownerId(ownerId)
   .build();

  PaymentTransaction saved = transactionRepository.save(transaction);

  if ("VNPAY".equals(selectedProvider)) {
   saved.setPaymentUrl(buildVnpayUrl(saved, amount));
  } else {
   saved.setPaymentUrl(SANDBOX_WEB_BASE_URL + "/mock-payment?transactionId=" + saved.getId());
  }
  return transactionRepository.save(saved);
 }

 // VNPay return URL callback
 @Transactional
 public boolean processVnpayCallback(Map<String, String> params) {
  String secureHash = params.get("vnp_SecureHash");
  String txnRef = params.get("vnp_TxnRef");

  UUID transactionId = null;
  try { transactionId = UUID.fromString(txnRef); } catch (Exception ignored) {}

  boolean sigValid = secureHash != null && verifySignature(params, secureHash);
  if (transactionId != null) {
   saveCallbackLog(transactionId, "VNPAY_RETURN", params, sigValid);
  }

  if (!sigValid) {
   log.error("VNPay return URL signature verification failed or hash is missing.");
   return false;
  }

  PaymentTransaction transaction = transactionRepository.findById(transactionId)
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
   publishPaymentFailed(transaction, "VNPAY_CODE_" + responseCode);
   return false;
  }
 }

 // VNPay IPN (server-to-server)
 @Transactional
 public Map<String, String> processVnpayIpn(Map<String, String> params) {
  log.info("Processing VNPay IPN callback: {}", params);
  Map<String, String> response = new java.util.HashMap<>();

  String txnRef = params.get("vnp_TxnRef");
  UUID transactionId = null;
  try { transactionId = UUID.fromString(txnRef); } catch (IllegalArgumentException e) {
   log.error("Invalid transaction ID format in IPN: {}", txnRef);
   response.put("RspCode", "01");
   response.put("Message", "Order not found");
   return response;
  }

  String secureHash = params.get("vnp_SecureHash");
  boolean sigValid = secureHash != null && verifySignature(params, secureHash);
  saveCallbackLog(transactionId, "VNPAY_IPN", params, sigValid);

  if (!sigValid) {
   log.error("VNPay IPN signature verification failed.");
   response.put("RspCode", "97");
   response.put("Message", "Invalid signature");
   return response;
  }

  Optional<PaymentTransaction> optionalTx = transactionRepository.findById(transactionId);
  if (optionalTx.isEmpty()) {
   log.error("Transaction not found in IPN: {}", txnRef);
   response.put("RspCode", "01");
   response.put("Message", "Order not found");
   return response;
  }

  PaymentTransaction transaction = optionalTx.get();

  String vnpAmountStr = params.get("vnp_Amount");
  if (vnpAmountStr == null || vnpAmountStr.isBlank()) {
   response.put("RspCode", "04");
   response.put("Message", "Invalid Amount");
   return response;
  }

  BigDecimal vnpAmount = new BigDecimal(vnpAmountStr).divide(BigDecimal.valueOf(100));
  if (transaction.getAmount().compareTo(vnpAmount) != 0) {
   log.error("Amount mismatch in IPN. DB: {}, VNPay: {}", transaction.getAmount(), vnpAmount);
   response.put("RspCode", "04");
   response.put("Message", "Invalid Amount");
   return response;
  }

  if (!"PENDING".equals(transaction.getStatus())) {
   log.info("Transaction {} already processed in IPN. Current status: {}", txnRef, transaction.getStatus());
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
   publishPaymentFailed(transaction, "VNPAY_IPN_CODE_" + responseCode);
  }

  response.put("RspCode", "00");
  response.put("Message", "Confirm success");
  return response;
 }

 // Mock callback (dev/test only)
 @Transactional
 public void processMockCallback(UUID transactionId, boolean success) {
  PaymentTransaction transaction = transactionRepository.findById(transactionId)
   .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

  saveCallbackLog(transactionId, "MOCK_CALLBACK",
   Map.of("transactionId", transactionId.toString(), "success", String.valueOf(success)), true);

  if (success) {
   updateSuccessPayment(transaction);
  } else {
   transaction.setStatus("FAILED");
   transactionRepository.save(transaction);
   publishPaymentFailed(transaction, "MOCK_FAILED");
  }
 }

 // REFUND: refund a successful payment by bookingId
 @Transactional
 public void refundPayment(UUID bookingId) {
  log.info("Processing refund for booking {}", bookingId);

  PaymentTransaction transaction = transactionRepository
   .findByBookingIdAndStatusAndRefundedFalse(bookingId, "SUCCESS")
   .orElseThrow(() -> new IllegalStateException(
    "Không tìm thấy giao dịch thanh toán thành công chưa hoàn tiền cho booking " + bookingId));

  BigDecimal commissionRate = getCommissionRate();
  BigDecimal platformFee = transaction.getAmount().multiply(commissionRate);
  BigDecimal netAmount = transaction.getAmount().subtract(platformFee);

  boolean walletSaved = false;
  if (transaction.getOwnerId() != null) {
   OwnerWallet wallet = walletRepository.findByOwnerId(transaction.getOwnerId())
    .orElseThrow(() -> new IllegalStateException(
     "Không tìm thấy ví chủ sân: " + transaction.getOwnerId()));
   BigDecimal before = wallet.getBalance();
   wallet.setBalance(wallet.getBalance().subtract(netAmount));
   wallet.setTotalEarned(wallet.getTotalEarned().subtract(netAmount));
   if (wallet.getBalance().compareTo(BigDecimal.ZERO) < 0) {
    log.warn("Owner wallet {} balance went negative after refund: {}",
     transaction.getOwnerId(), wallet.getBalance());
   }
   try {
    walletRepository.save(wallet);
    recordWalletTx(transaction.getOwnerId(), netAmount.negate(), "REFUND",
     "Hoan tien booking " + bookingId, transaction.getId(), before, wallet.getBalance());
    walletSaved = true;
   } catch (OptimisticLockingFailureException e) {
    log.warn("Optimistic lock conflict during refund for owner {} — retrying", transaction.getOwnerId());
    OwnerWallet refreshed = walletRepository.findByOwnerId(transaction.getOwnerId())
     .orElseThrow(() -> new IllegalStateException("Wallet disappeared during refund retry"));
    BigDecimal retryBefore = refreshed.getBalance();
    refreshed.setBalance(refreshed.getBalance().subtract(netAmount));
    refreshed.setTotalEarned(refreshed.getTotalEarned().subtract(netAmount));
    walletRepository.save(refreshed);
    recordWalletTx(transaction.getOwnerId(), netAmount.negate(), "REFUND",
     "Hoan tien booking " + bookingId, transaction.getId(), retryBefore, refreshed.getBalance());
    walletSaved = true;
   }
   if (walletSaved) {
    log.info("Reversed wallet credit for owner {}: -{} (net)", transaction.getOwnerId(), netAmount);
   }
  }

  transaction.setRefunded(true);
  transaction.setRefundedAt(LocalDateTime.now());
  transactionRepository.save(transaction);

  eventPublisher.publishPaymentRefunded(PaymentRefundedEvent.builder()
   .eventId(UUID.randomUUID())
   .eventType("PaymentRefunded")
   .bookingId(transaction.getBookingId())
   .transactionId(transaction.getId())
   .userId(transaction.getUserId())
   .venueId(transaction.getVenueId())
   .ownerId(transaction.getOwnerId())
   .amount(transaction.getAmount())
   .netAmount(netAmount)
   .refundedAt(transaction.getRefundedAt())
   .build());

  log.info("Refund processed for booking {}: tx={} refunded {} (gross), {} (net)",
   bookingId, transaction.getId(), transaction.getAmount(), netAmount);
 }

 // Core: mark SUCCESS + credit owner wallet
 private void updateSuccessPayment(PaymentTransaction transaction) {
  if (transaction.getOwnerId() == null) {
   throw new IllegalStateException(
    "Cannot credit owner wallet: ownerId is null for transaction " + transaction.getId()
    + ". Payment was created without ownerId — check CreatePaymentRequest.ownerId");
  }

  transaction.setStatus("SUCCESS");
  transaction.setPaidAt(LocalDateTime.now());
  transactionRepository.save(transaction);

  OwnerWallet wallet = walletRepository.findByOwnerId(transaction.getOwnerId())
   .orElseGet(() -> {
    log.warn("OwnerWallet not found for ownerId={}, creating new wallet", transaction.getOwnerId());
    return OwnerWallet.builder()
     .ownerId(transaction.getOwnerId())
     .balance(BigDecimal.ZERO)
     .totalEarned(BigDecimal.ZERO)
     .totalWithdrawn(BigDecimal.ZERO)
     .version(0)
     .build();
   });

  BigDecimal commissionRate = getCommissionRate();
  BigDecimal platformFee = transaction.getAmount().multiply(commissionRate);
  BigDecimal netAmount = transaction.getAmount().subtract(platformFee);
  BigDecimal before = wallet.getBalance();

  wallet.setBalance(wallet.getBalance().add(netAmount));
  wallet.setTotalEarned(wallet.getTotalEarned().add(netAmount));

  boolean saved = false;
  try {
   walletRepository.save(wallet);
   saved = true;
   log.info("Credited owner wallet {} with net={} (commission {}%, fee={})",
    transaction.getOwnerId(), netAmount,
    commissionRate.multiply(BigDecimal.valueOf(100)).intValue(), platformFee);
  } catch (OptimisticLockingFailureException e) {
   log.warn("Optimistic lock conflict for owner {} during payment credit — retrying", transaction.getOwnerId());
   OwnerWallet refreshed = walletRepository.findByOwnerId(transaction.getOwnerId())
    .orElseThrow(() -> new IllegalStateException("Wallet disappeared during optimistic lock retry"));
   BigDecimal retryBefore = refreshed.getBalance();
   refreshed.setBalance(refreshed.getBalance().add(netAmount));
   refreshed.setTotalEarned(refreshed.getTotalEarned().add(netAmount));
   walletRepository.save(refreshed);
   recordWalletTx(transaction.getOwnerId(), netAmount, "CREDIT",
    "Thu nhap tu dat san (booking " + transaction.getBookingId() + ")", transaction.getId(), retryBefore, refreshed.getBalance());
   log.info("Credited owner wallet {} with net={} (commission {}%, fee={}) [retry]",
    transaction.getOwnerId(), netAmount,
    commissionRate.multiply(BigDecimal.valueOf(100)).intValue(), platformFee);
   saved = true;
  }

  if (saved) {
   recordWalletTx(transaction.getOwnerId(), netAmount, "CREDIT",
    "Thu nhap tu dat san (booking " + transaction.getBookingId() + ")",
    transaction.getId(), before, wallet.getBalance());
  } else {
   log.error("CRITICAL: failed to save wallet for owner {} — balance NOT updated. amount={}",
    transaction.getOwnerId(), netAmount);
  }

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

 // Publish PaymentFailed event
 private void publishPaymentFailed(PaymentTransaction transaction, String reason) {
  eventPublisher.publishPaymentFailed(PaymentFailedEvent.builder()
   .eventId(UUID.randomUUID())
   .eventType("PaymentFailed")
   .bookingId(transaction.getBookingId())
   .transactionId(transaction.getId())
   .userId(transaction.getUserId())
   .amount(transaction.getAmount())
   .failureReason(reason)
   .failedAt(LocalDateTime.now())
   .build());
  log.info("Published PaymentFailedEvent for booking {}: {}", transaction.getBookingId(), reason);
 }

 // Audit log: persist raw callback payload
 private void saveCallbackLog(UUID transactionId, String provider,
  Map<String, String> payload, boolean signatureValid) {
  try {
   PaymentCallback callback = PaymentCallback.builder()
    .transactionId(transactionId)
    .provider(provider)
    .rawPayload(objectMapper.valueToTree(payload))
    .signatureValid(signatureValid)
    .handled(signatureValid)
    .build();
   callbackRepository.save(callback);
  } catch (Exception e) {
   log.warn("Failed to save callback audit log", e);
  }
 }

 // VNPay URL builder
 public String getVnpayFrontendUrl() {
  return vnpayFrontendUrl;
 }

 private String buildVnpayUrl(PaymentTransaction transaction, BigDecimal amount) {
  try {
   Map<String, String> params = new java.util.TreeMap<>();
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
   String secureHash = hmacSHA512(hashData, vnpayHashSecret);

   StringBuilder qs = new StringBuilder();
   for (Map.Entry<String, String> e : params.entrySet()) {
    if (qs.length() > 0) qs.append('&');
    qs.append(encode(e.getKey())).append('=').append(encode(e.getValue()));
   }
   qs.append("&vnp_SecureHash=").append(secureHash);
   return vnpaySandboxUrl + "?" + qs.toString();
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
   javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA512");
   mac.init(new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
   byte[] result = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
   StringBuilder sb = new StringBuilder();
   for (byte b : result) sb.append(String.format("%02x", b));
   return sb.toString();
  } catch (Exception e) {
   throw new RuntimeException("Failed to generate HMAC SHA512", e);
  }
 }

 private boolean verifySignature(Map<String, String> params, String secureHash) {
  Map<String, String> hashParams = new java.util.TreeMap<>();
  for (Map.Entry<String, String> entry : params.entrySet()) {
   String key = entry.getKey();
   if (key != null && key.startsWith("vnp_") && !key.equals("vnp_SecureHash") && !key.equals("vnp_SecureHashType")) {
    hashParams.put(key, entry.getValue());
   }
  }
  String hashData = buildHashParams(hashParams);
  return hmacSHA512(hashData, vnpayHashSecret).equalsIgnoreCase(secureHash);
 }

 private String buildHashParams(Map<String, String> hashParams) {
  StringBuilder sb = new StringBuilder();
  for (Map.Entry<String, String> entry : hashParams.entrySet()) {
   String v = entry.getValue();
   if (v != null && !v.isBlank()) {
    if (sb.length() > 0) sb.append('&');
    try {
     sb.append(entry.getKey()).append('=')
      .append(URLEncoder.encode(v, StandardCharsets.UTF_8.toString()));
    } catch (Exception e) {
     log.error("Failed to encode value: {}", v, e);
    }
   }
  }
  return sb.toString();
 }
}
