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
  private final EmailService emailService;

  public void sendPasswordResetOtp(String email) {
    log.info("Processing forgot password request for email: {}", email);

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "No user found with this email"));

    String otp = otpService.generateOtp(email);
    emailService.sendOtpEmail(email, otp);
    log.info("OTP sent to email: {}", email);
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