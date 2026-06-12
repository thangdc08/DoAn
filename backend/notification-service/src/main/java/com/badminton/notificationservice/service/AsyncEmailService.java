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

@Async("emailExecutor")
public void sendBookingConfirmedEmail(String toEmail, String venueName, String bookingId) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject("Đơn Đặt Sân Đã Được Chủ Sân Xác Nhận");
    message.setText("Xin chào,\n\nĐơn đặt sân của bạn tại sân \"" + venueName + "\" (Mã đơn: " + bookingId + ") đã được chủ sân xác nhận.\n\nChúc bạn có giờ chơi vui vẻ!\n\nTrân trọng,\nBadminton Platform Team");

    try {
        mailSender.send(message);
        log.info("[AsyncEmail] Sent booking confirmed to {} (booking={})", toEmail, bookingId);
    } catch (Exception e) {
        log.error("[AsyncEmail] Failed to send booking confirmed email: {}", e.getMessage());
    }
}

@Async("emailExecutor")
public void sendBookingCancelledByOwnerEmail(String toEmail, String venueName, String bookingId, String reason) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject("Đơn Đặt Sân Đã Bị Hủy");
    message.setText("Xin chào,\n\nRất tiếc, đơn đặt sân của bạn tại sân \"" + venueName + "\" (Mã đơn: " + bookingId + ") đã bị chủ sân từ chối/hủy vì lý do: " + reason + ".\n\nHệ thống đã tự động thực hiện hoàn tiền cho bạn.\n\nTrân trọng,\nBadminton Platform Team");

    try {
        mailSender.send(message);
        log.info("[AsyncEmail] Sent booking cancelled to {} (booking={})", toEmail, bookingId);
    } catch (Exception e) {
        log.error("[AsyncEmail] Failed to send booking cancelled email: {}", e.getMessage());
    }
}

@Async("emailExecutor")
public void sendOwnerConfirmationReminderEmail(String toEmail, String venueName, String bookingId) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject("Nhắc Nhở Duyệt Đơn Đặt Sân Đang Chờ");
    message.setText("Xin chào,\n\nBạn có đơn đặt sân mới đang chờ duyệt tại sân \"" + venueName + "\" (Mã đơn: " + bookingId + ").\nVui lòng truy cập trang quản lý của chủ sân để duyệt đơn kịp thời.\n\nTrân trọng,\nBadminton Platform Team");

    try {
        mailSender.send(message);
        log.info("[AsyncEmail] Sent owner confirmation reminder to {} (booking={})", toEmail, bookingId);
    } catch (Exception e) {
        log.error("[AsyncEmail] Failed to send owner confirmation reminder email: {}", e.getMessage());
    }
}

@Async("emailExecutor")
public void sendPlayerPlaytimeReminderEmail(String toEmail, String venueName, String bookingId, String startTime) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject("Nhắc Nhở: Sắp Đến Giờ Chơi Của Bạn");
    message.setText("Xin chào,\n\nBạn có lịch đặt sân sắp diễn ra vào lúc: " + startTime + " tại sân \"" + venueName + "\".\nMã đơn đặt sân: " + bookingId + ".\nVui lòng chuẩn bị và đến sân đúng giờ.\n\nChúc bạn có buổi chơi vui vẻ!\n\nTrân trọng,\nBadminton Platform Team");

    try {
        mailSender.send(message);
        log.info("[AsyncEmail] Sent player playtime reminder to {} (booking={})", toEmail, bookingId);
    } catch (Exception e) {
        log.error("[AsyncEmail] Failed to send player playtime reminder email: {}", e.getMessage());
    }
}

@Async("emailExecutor")
public void sendMatchPlaytimeReminderEmail(String toEmail, String matchTitle, String startTime, String venueName) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject("Nhắc Nhở Kèo Đấu Sắp Diễn Ra");
    message.setText("Xin chào,\n\nKèo đấu \"" + matchTitle + "\" mà bạn tham gia sắp diễn ra vào lúc: " + startTime + " tại địa điểm \"" + venueName + "\".\nHãy chuẩn bị sẵn sàng và đến giao lưu đúng giờ nhé!\n\nTrân trọng,\nBadminton Platform Team");

    try {
        mailSender.send(message);
        log.info("[AsyncEmail] Sent match playtime reminder to {}", toEmail);
    } catch (Exception e) {
        log.error("[AsyncEmail] Failed to send match playtime reminder email: {}", e.getMessage());
    }
}
}
