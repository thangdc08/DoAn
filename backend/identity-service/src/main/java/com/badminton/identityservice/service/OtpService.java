package com.badminton.identityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_MINUTES = 10;
    private static final SecureRandom random = new SecureRandom();

    public String generateOtp(String email) {
        // Generate 6-digit OTP
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        
        String otpCode = otp.toString();
        String key = OTP_PREFIX + email;
        
        // Store in Redis with expiry
        redisTemplate.opsForValue().set(key, otpCode, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        
        log.info("Generated OTP for email: {} (expires in {} minutes)", email, OTP_EXPIRY_MINUTES);
        return otpCode;
    }

    public boolean validateOtp(String email, String otp) {
        String key = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(key);
        
        if (storedOtp == null) {
            log.warn("OTP not found or expired for email: {}", email);
            return false;
        }
        
        boolean isValid = storedOtp.equals(otp);
        
        if (isValid) {
            // Delete OTP after successful validation
            redisTemplate.delete(key);
            log.info("OTP validated and deleted for email: {}", email);
        } else {
            log.warn("Invalid OTP attempt for email: {}", email);
        }
        
        return isValid;
    }

    public void deleteOtp(String email) {
        String key = OTP_PREFIX + email;
        redisTemplate.delete(key);
        log.info("OTP deleted for email: {}", email);
    }
}