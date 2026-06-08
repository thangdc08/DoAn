package com.badminton.identityservice.controller;

import com.badminton.identityservice.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/system-config")
@RequiredArgsConstructor
@Tag(name = "Admin - System Config", description = "Admin CRUD for system configuration & policies")
public class SystemConfigController {

    private final SystemConfigService configService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all system configurations")
    public ResponseEntity<Map<String, String>> getAll() {
        return ResponseEntity.ok(configService.getAll());
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get configs by category")
    public ResponseEntity<Map<String, String>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(configService.getByCategory(category.toUpperCase()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Save (upsert) config key-value pairs")
    public ResponseEntity<Map<String, Object>> saveAll(
            @RequestHeader(value = "X-Auth-User-Id", defaultValue = "admin") String userId,
            @RequestBody Map<String, String> configs) {
        configService.upsertBatch(configs, userId);
        return ResponseEntity.ok(Map.of("message", "Đã lưu " + configs.size() + " cấu hình", "saved", configs.size()));
    }
}
