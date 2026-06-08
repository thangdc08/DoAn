package com.badminton.identityservice.configuration;

import com.badminton.identityservice.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SystemConfigInitializer implements CommandLineRunner {

    private final SystemConfigService configService;

    @Override
    public void run(String... args) {
        log.info("Seeding default system configurations...");
        seed("site_name",                   "BadmintonHub",                          "GENERAL",          "Tên nền tảng");
        seed("site_url",                    "https://badmintonhub.vn",               "GENERAL",          "URL chính thức");
        seed("support_email",               "support@badmintonhub.vn",               "GENERAL",          "Email hỗ trợ");
        seed("support_phone",               "0900 000 000",                          "GENERAL",          "Số điện thoại hỗ trợ");
        seed("timezone",                    "Asia/Ho_Chi_Minh",                      "GENERAL",          "Múi giờ hệ thống");
        seed("language",                    "vi",                                    "GENERAL",          "Ngôn ngữ mặc định");
        seed("maintenance_mode",            "false",                                 "GENERAL",          "Chế độ bảo trì");
        seed("maintenance_msg",             "Hệ thống đang bảo trì, vui lòng quay lại sau.", "GENERAL", "Thông báo bảo trì");

        seed("jwt_expire_hours",            "24",                                    "SECURITY",         "JWT token hết hạn sau N giờ");
        seed("max_login_attempts",          "5",                                     "SECURITY",         "Số lần đăng nhập sai tối đa");
        seed("lockout_minutes",             "15",                                    "SECURITY",         "Khóa tài khoản sau N phút");
        seed("require_email_verify",        "false",                                 "SECURITY",         "Bắt buộc xác thực email");
        seed("enable_2fa",                  "false",                                 "SECURITY",         "Cho phép xác thực 2 yếu tố");

        seed("email_enabled",               "true",                                  "NOTIFICATION",     "Bật gửi email");
        seed("smtp_host",                   "",                                      "NOTIFICATION",     "SMTP Host");
        seed("smtp_port",                   "587",                                   "NOTIFICATION",     "SMTP Port");
        seed("smtp_user",                   "",                                      "NOTIFICATION",     "Tài khoản SMTP");
        seed("smtp_password",               "",                                      "NOTIFICATION",     "Mật khẩu SMTP");
        seed("notify_new_booking",          "true",                                  "NOTIFICATION",     "Gửi thông báo booking mới");
        seed("notify_payout",               "true",                                  "NOTIFICATION",     "Gửi thông báo rút tiền");
        seed("notify_report",               "true",                                  "NOTIFICATION",     "Gửi thông báo vi phạm");

        seed("platform_commission_pct",     "10",                                    "POLICY_BOOKING",   "Tỉ lệ hoa hồng nền tảng (%)");
        seed("booking_advance_days",        "30",                                    "POLICY_BOOKING",   "Đặt sân trước tối đa N ngày");
        seed("max_bookings_per_day",        "5",                                     "POLICY_BOOKING",   "Số booking tối đa mỗi ngày/người dùng");
        seed("cancellation_window_hours",   "2",                                     "POLICY_BOOKING",   "Thời gian cho phép hủy booking (giờ trước giờ chơi)");
        seed("auto_expire_minutes",         "15",                                    "POLICY_BOOKING",   "Tự động hủy booking chưa thanh toán sau N phút");

        seed("min_court_price",             "50000",                                 "POLICY_VENUE",     "Giá sân tối thiểu (VND/giờ)");
        seed("max_court_price",             "500000",                                "POLICY_VENUE",     "Giá sân tối đa (VND/giờ)");
        seed("max_courts_per_venue",        "20",                                    "POLICY_VENUE",     "Số sân tối đa mỗi cơ sở");
        seed("venue_require_approval",      "true",                                  "POLICY_VENUE",     "Cơ sở mới phải chờ phê duyệt");
        seed("venue_auto_approve_days",     "0",                                     "POLICY_VENUE",     "Tự động phê duyệt sau N ngày (0 = không tự động)");

        seed("max_active_bookings_per_user","10",                                    "POLICY_USER",      "Số booking đang mở tối đa mỗi người dùng");
        seed("no_show_penalty_enabled",     "false",                                 "POLICY_USER",      "Áp dụng phạt khi vắng mặt không thông báo");
        seed("suspend_after_no_shows",      "3",                                     "POLICY_USER",      "Tạm đình chỉ sau N lần vắng mặt");
        seed("review_required_after_booking","false",                                "POLICY_USER",      "Yêu cầu đánh giá sau mỗi booking");

        seed("match_cancel_before_hours",   "2",                                     "POLICY_MATCH",     "Thời gian hủy kèo tối thiểu (Giờ)");
        seed("max_active_matches_per_user", "5",                                     "POLICY_MATCH",     "Số kèo hoạt động tối đa mỗi người dùng");
        seed("match_platform_fee",          "0",                                     "POLICY_MATCH",     "Phí dịch vụ tạo kèo (VND)");
        seed("enable_match_auto_close",     "true",                                  "POLICY_MATCH",     "Tự động đóng kèo khi đủ người");

        log.info("System config seeding complete.");
    }

    private void seed(String key, String value, String category, String description) {
        configService.seedIfAbsent(key, value, category, description);
    }
}
