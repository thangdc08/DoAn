package com.badminton.notificationservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.from-address:badminton.platform.noreply@gmail.com}")
    private String fromAddress;

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
            log.info("Booking confirmation email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to {}", toEmail, e);
        }
    }
}
