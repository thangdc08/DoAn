package com.badminton.identityservice.service;

import com.badminton.identityservice.entity.SystemConfig;
import com.badminton.identityservice.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemConfigService {

    private final SystemConfigRepository configRepository;

    /** Trả về toàn bộ config dạng Map<key, value> */
    public Map<String, String> getAll() {
        Map<String, String> result = new LinkedHashMap<>();
        configRepository.findAll().forEach(c -> result.put(c.getConfigKey(), c.getConfigValue()));
        return result;
    }

    /** Trả về config theo category */
    public Map<String, String> getByCategory(String category) {
        Map<String, String> result = new LinkedHashMap<>();
        configRepository.findByCategory(category).forEach(c -> result.put(c.getConfigKey(), c.getConfigValue()));
        return result;
    }

    /** Lấy giá trị một key, trả default nếu không có */
    public String getValue(String key, String defaultValue) {
        return configRepository.findByConfigKey(key)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }

    /** Lưu hàng loạt — upsert theo key */
    @Transactional
    public void upsertBatch(Map<String, String> configs, String updatedBy) {
        configs.forEach((key, value) -> {
            SystemConfig cfg = configRepository.findByConfigKey(key)
                    .orElseGet(() -> SystemConfig.builder().configKey(key).category(detectCategory(key)).build());
            cfg.setConfigValue(value);
            cfg.setUpdatedBy(updatedBy);
            configRepository.save(cfg);
        });
        log.info("Saved {} config entries by {}", configs.size(), updatedBy);
    }

    /** Seed giá trị mặc định nếu chưa tồn tại */
    @Transactional
    public void seedIfAbsent(String key, String value, String category, String description) {
        if (!configRepository.existsByConfigKey(key)) {
            configRepository.save(SystemConfig.builder()
                    .configKey(key).configValue(value)
                    .category(category).description(description)
                    .updatedBy("SYSTEM")
                    .build());
        }
    }

    private String detectCategory(String key) {
        if (key.startsWith("jwt_") || key.startsWith("max_login") || key.startsWith("lockout")) return "SECURITY";
        if (key.startsWith("smtp_") || key.startsWith("email_") || key.startsWith("notify_")) return "NOTIFICATION";
        if (key.startsWith("booking_") || key.startsWith("auto_expire") || key.startsWith("cancellation")
                || key.startsWith("platform_") || key.startsWith("max_bookings")) return "POLICY_BOOKING";
        if (key.startsWith("venue_") || key.startsWith("min_court") || key.startsWith("max_court")
                || key.startsWith("max_courts")) return "POLICY_VENUE";
        if (key.startsWith("user_") || key.startsWith("no_show") || key.startsWith("suspend")
                || key.startsWith("max_active")) return "POLICY_USER";
        return "GENERAL";
    }
}
