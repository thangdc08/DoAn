package com.badminton.paymentservice.controller;

import com.badminton.paymentservice.entity.SystemConfig;
import com.badminton.paymentservice.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@Slf4j
public class AdminConfigController {

    private final SystemConfigRepository configRepository;

    @GetMapping
    public List<SystemConfig> getAllConfigs() {
        return configRepository.findAll();
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemConfig> getConfig(@PathVariable String key) {
        return configRepository.findByConfigKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemConfig> updateConfig(
            @PathVariable String key,
            @RequestBody Map<String, String> body) {
        return configRepository.findByConfigKey(key)
                .map(config -> {
                    config.setConfigValue(body.get("value"));
                    config.setDescription(body.getOrDefault("description", config.getDescription()));
                    SystemConfig saved = configRepository.save(config);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> {
                    SystemConfig config = SystemConfig.builder()
                            .configKey(key)
                            .configValue(body.get("value"))
                            .description(body.getOrDefault("description", ""))
                            .build();
                    return ResponseEntity.ok(configRepository.save(config));
                });
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteConfig(@PathVariable String key) {
        configRepository.findByConfigKey(key).ifPresent(configRepository::delete);
        return ResponseEntity.noContent().build();
    }
}
