package com.badminton.identityservice.service;

import com.badminton.common.exception.AppException;
import com.badminton.identityservice.dto.request.ResetPasswordRequest;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordRecoveryService {

  private final UserRepository userRepository;
  private final OtpService otpService;
  private final PasswordEncoder passwordEncoder;
  // TODO: Inject EmailService when implemented

  public void sendPasswordResetOtp(String email) {
    log.info("Processing forgot password request for email: {}", email);

    // Check if user exists
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "No user found with this email"));

    // Generate OTP
    String otp = otpService.generateOtp(email);

    // TODO: Send OTP via email
    // For now, just log it (in production, use email service)
    log.info("OTP for {}: {} (THIS SHOULD BE SENT VIA EMAIL IN PRODUCTION)", email, otp);

    // In development, you can return OTP in response or log it
    // In production, NEVER expose OTP in logs or responses
  }

  @Transactional
  public void resetPassword(ResetPasswordRequest request) {
    log.info("Processing password reset for email: {}", request.getEmail());

    // Validate OTP
    boolean isValidOtp = otpService.validateOtp(request.getEmail(), request.getOtp());
    if (!isValidOtp) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Invalid or expired OTP");
    }

    // Find user
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found"));

    // Update password
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    log.info("Password reset successful for user: {}", user.getId());
  }
}