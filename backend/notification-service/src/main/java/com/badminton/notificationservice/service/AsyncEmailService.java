package com.badminton.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.Executor;

@Service
@RequiredArgsConstructor
@Slf4j
public class AsyncEmailService {

private final JavaMailSender mailSender;
private final Executor emailExecutor;
@Value("${spring.mail.from-address:badminton.platform.noreply@gmail.com}")
private String fromAddress;

@Async("emailExecutor")
public void sendBookingPaidEmail(String toEmail, String venueName, String bookingId) {
SimpleMailMessage message = new SimpleMailMessage();
message.setFrom(fromAddress);
message.setTo(toEmail);
message.setSubject("Xác Nhận Đặt Sân Thành Công");
message.setText("Xin chào,\n\nBạn đã thanh toán đặt sân thành công tại: " + venueName +
"\nMã đặt sân của bạn là: " + bookingId +
"\n\nCảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.\n\nTrân trọng,\nBadminton Platform Team");

try {
mailSender.send(message);
log.info("[AsyncEmail] Sent booking confirmation to {} (booking={})", toEmail, bookingId);
} catch (Exception e) {
log.error("[AsyncEmail] Failed to send email to {} (booking={}): {}", toEmail, bookingId, e.getMessage());
}
}

@Async("emailExecutor")
public void sendOtpEmail(String toEmail, String otpCode) {
SimpleMailMessage message = new SimpleMailMessage();
message.setFrom(fromAddress);
message.setTo(toEmail);
message.setSubject("Mã OTP Đăng Nhập");
message.setText("Mã OTP của bạn là: " + otpCode + "\nMã có hiệu lực trong 5 phút.\n\nTrân trọng,\nBadminton Platform Team");

try {
mailSender.send(message);
log.info("[AsyncEmail] Sent OTP to {}", toEmail);
} catch (Exception e) {
log.error("[AsyncEmail] Failed to send OTP to {}: {}", toEmail, e.getMessage());
}
}
}
