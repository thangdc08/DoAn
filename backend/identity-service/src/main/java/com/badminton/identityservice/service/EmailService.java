package com.badminton.identityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("badminton.platform.noreply@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Mã OTP Khôi Phục Mật Khẩu");
        message.setText("Mã OTP khôi phục mật khẩu của bạn là: " + otp + "\nMã này có hiệu lực trong vòng 5 phút.");
        
        try {
            mailSender.send(message);
            log.info("Sent OTP email successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", toEmail, e);
        }
    }
}
