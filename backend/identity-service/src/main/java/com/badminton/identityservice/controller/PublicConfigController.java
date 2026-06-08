package com.badminton.identityservice.controller;

import com.badminton.identityservice.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/config")
@RequiredArgsConstructor
@Tag(name = "Public Config", description = "Public endpoints for other services to read non-sensitive configs")
public class PublicConfigController {

    private final SystemConfigService configService;

    // Keys that are safe to expose publicly (non-sensitive)
    private static final Set<String> PUBLIC_KEYS = Set.of(
            "site_name", "site_url", "support_email", "support_phone",
            "maintenance_mode", "maintenance_msg", "timezone", "language",
            "platform_commission_pct",
            "booking_advance_days", "max_bookings_per_day",
            "cancellation_window_hours", "auto_expire_minutes",
            "min_court_price", "max_court_price", "max_courts_per_venue",
            "venue_require_approval",
            "max_active_bookings_per_user", "no_show_penalty_enabled",
            "suspend_after_no_shows",
            "match_cancel_before_hours", "max_active_matches_per_user",
            "match_platform_fee", "enable_match_auto_close"
    );

    @GetMapping("/public")
    @Operation(summary = "Get all non-sensitive public configs")
    public ResponseEntity<Map<String, String>> getPublic() {
        Map<String, String> all = configService.getAll();
        all.keySet().retainAll(PUBLIC_KEYS);
        return ResponseEntity.ok(all);
    }

    @GetMapping("/policy/{category}")
    @Operation(summary = "Get policy config by category for internal service use")
    public ResponseEntity<Map<String, String>> getPolicy(@PathVariable String category) {
        return ResponseEntity.ok(configService.getByCategory(category.toUpperCase()));
    }
}
