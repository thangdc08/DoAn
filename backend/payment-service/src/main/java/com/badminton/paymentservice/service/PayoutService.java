package com.badminton.paymentservice.service;

import com.badminton.paymentservice.entity.OwnerWallet;
import com.badminton.paymentservice.entity.PayoutRequest;
import com.badminton.paymentservice.entity.WalletTransaction;
import com.badminton.paymentservice.event.PayoutApprovedEvent;
import com.badminton.paymentservice.event.PayoutRejectedEvent;
import com.badminton.paymentservice.repository.OwnerWalletRepository;
import com.badminton.paymentservice.repository.PayoutRequestRepository;
import com.badminton.paymentservice.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutService {

 private final OwnerWalletRepository walletRepository;
 private final PayoutRequestRepository payoutRepository;
 private final WalletTransactionRepository walletTxRepository;
 private final PaymentEventPublisher eventPublisher;

 @Transactional
 public OwnerWallet getOrCreateWallet(UUID ownerId) {
  return walletRepository.findByOwnerId(ownerId)
   .orElseGet(() -> walletRepository.save(OwnerWallet.builder()
    .ownerId(ownerId)
    .balance(BigDecimal.ZERO)
    .totalEarned(BigDecimal.ZERO)
    .totalWithdrawn(BigDecimal.ZERO)
    .build()));
 }

 private void recordWalletTx(UUID ownerId, BigDecimal amount, String type, String description,
  UUID relatedTxId, UUID relatedPayoutId, BigDecimal before, BigDecimal after) {
  try {
   walletTxRepository.save(WalletTransaction.builder()
    .ownerId(ownerId)
    .amount(amount)
    .type(type)
    .status("SUCCESS")
    .description(description)
    .relatedTransactionId(relatedTxId)
    .relatedPayoutRequestId(relatedPayoutId)
    .balanceBefore(before)
    .balanceAfter(after)
    .build());
  } catch (Exception e) {
   log.warn("Failed to record wallet transaction audit", e);
  }
 }

 @Transactional
 public PayoutRequest createPayoutRequest(UUID ownerId, BigDecimal amount, String bankName,
  String bankAccount, String bankAccountName, String notes) {
  log.info("Owner {} requesting payout of {}", ownerId, amount);
  if (amount.compareTo(BigDecimal.ZERO) <= 0) {
   throw new IllegalArgumentException("Số tiền rút phải lớn hơn 0");
  }

  OwnerWallet wallet = getOrCreateWallet(ownerId);
  if (wallet.getBalance().compareTo(amount) < 0) {
   throw new IllegalStateException("Số dư khả dụng không đủ để thực hiện yêu cầu rút tiền");
  }

  BigDecimal before = wallet.getBalance();
  wallet.setBalance(wallet.getBalance().subtract(amount));
  try {
   walletRepository.save(wallet);
  } catch (OptimisticLockingFailureException e) {
   log.warn("Optimistic lock conflict for owner {} during payout request — retrying", ownerId);
   // Re-fetch and retry once
   OwnerWallet refreshed = getOrCreateWallet(ownerId);
   if (refreshed.getBalance().compareTo(amount) < 0) {
    throw new IllegalStateException("Số dư khả dụng không đủ để thực hiện yêu cầu rút tiền (concurrent update detected)");
   }
   BigDecimal retryBefore = refreshed.getBalance();
   refreshed.setBalance(refreshed.getBalance().subtract(amount));
   walletRepository.save(refreshed);
   wallet = refreshed;
   before = retryBefore;
  }

  recordWalletTx(ownerId, amount.negate(), "DEBIT",
   "Yeu cau rut tien: " + bankName + " ****" + maskAccount(bankAccount),
   null, null, before, wallet.getBalance());

  PayoutRequest request = PayoutRequest.builder()
   .ownerId(ownerId)
   .amount(amount)
   .status("PENDING")
   .bankName(bankName)
   .bankAccount(bankAccount)
   .bankAccountName(bankAccountName)
   .notes(notes)
   .build();

  return payoutRepository.save(request);
 }

 private String maskAccount(String account) {
  if (account == null || account.length() <= 4) return account;
  return "****" + account.substring(account.length() - 4);
 }

 @Transactional
 public PayoutRequest approvePayout(UUID requestId, String adminNotes) {
  log.info("Approving payout request {}", requestId);
  PayoutRequest request = payoutRepository.findById(requestId)
   .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu rút tiền"));

  if (!"PENDING".equals(request.getStatus())) {
   throw new IllegalStateException("Yêu cầu này đã được xử lý từ trước");
  }

  request.setStatus("APPROVED");
  request.setAdminNotes(adminNotes);
  request.setResolvedAt(LocalDateTime.now());

  OwnerWallet wallet = getOrCreateWallet(request.getOwnerId());
  BigDecimal before = wallet.getTotalWithdrawn();
  wallet.setTotalWithdrawn(wallet.getTotalWithdrawn().add(request.getAmount()));
  walletRepository.save(wallet);

  recordWalletTx(request.getOwnerId(), request.getAmount(), "PAYOUT_APPROVED",
   "Rut tien duoc phe duyet: " + request.getBankName(),
   null, requestId, before, wallet.getTotalWithdrawn());

  eventPublisher.publishPayoutApproved(PayoutApprovedEvent.builder()
   .eventType("PayoutApproved")
   .payoutRequestId(request.getId())
   .ownerId(request.getOwnerId())
   .amount(request.getAmount())
   .bankName(request.getBankName())
   .bankAccount(request.getBankAccount())
   .bankAccountName(request.getBankAccountName())
   .adminNotes(adminNotes)
   .resolvedAt(request.getResolvedAt())
   .build());

  return payoutRepository.save(request);
 }

 @Transactional
 public PayoutRequest rejectPayout(UUID requestId, String adminNotes) {
  log.info("Rejecting payout request {}", requestId);
  PayoutRequest request = payoutRepository.findById(requestId)
   .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu rút tiền"));

  if (!"PENDING".equals(request.getStatus())) {
   throw new IllegalStateException("Yêu cầu này đã được xử lý từ trước");
  }

  request.setStatus("REJECTED");
  request.setAdminNotes(adminNotes);
  request.setResolvedAt(LocalDateTime.now());

  OwnerWallet wallet = getOrCreateWallet(request.getOwnerId());
  BigDecimal before = wallet.getBalance();
  wallet.setBalance(wallet.getBalance().add(request.getAmount()));
  try {
   walletRepository.save(wallet);
  } catch (OptimisticLockingFailureException e) {
   log.warn("Optimistic lock conflict for owner {} during payout rejection — retrying", request.getOwnerId());
   OwnerWallet refreshed = getOrCreateWallet(request.getOwnerId());
   before = refreshed.getBalance();
   refreshed.setBalance(refreshed.getBalance().add(request.getAmount()));
   walletRepository.save(refreshed);
   wallet = refreshed;
  }

  recordWalletTx(request.getOwnerId(), request.getAmount(), "PAYOUT_REJECTED",
   "Rut tien bi tu choi, hoan tien: " + request.getBankName(),
   null, requestId, before, wallet.getBalance());

  eventPublisher.publishPayoutRejected(PayoutRejectedEvent.builder()
   .eventType("PayoutRejected")
   .payoutRequestId(request.getId())
   .ownerId(request.getOwnerId())
   .amount(request.getAmount())
   .adminNotes(adminNotes)
   .rejectionReason("Admin rejected: " + adminNotes)
   .resolvedAt(request.getResolvedAt())
   .build());

  return payoutRepository.save(request);
 }

 @Transactional(readOnly = true)
 public List<PayoutRequest> getPayoutRequestsByOwner(UUID ownerId) {
  return payoutRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
 }

 @Transactional(readOnly = true)
 public List<PayoutRequest> getAllPayoutRequests() {
  return payoutRepository.findAllByOrderByCreatedAtDesc();
 }

 @Transactional
 public OwnerWallet addTestFunds(UUID ownerId, BigDecimal amount) {
  log.info("Adding test funds {} to owner {}", amount, ownerId);
  OwnerWallet wallet = getOrCreateWallet(ownerId);
  BigDecimal before = wallet.getBalance();
  wallet.setBalance(wallet.getBalance().add(amount));
  wallet.setTotalEarned(wallet.getTotalEarned().add(amount));
  OwnerWallet saved = walletRepository.save(wallet);

  recordWalletTx(ownerId, amount, "CREDIT", "Test funds (dev)", null, null, before, saved.getBalance());
  return saved;
 }
}
