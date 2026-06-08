package com.badminton.bookingservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Reads system policy config from identity-service via API Gateway.
 * Falls back to safe defaults if the call fails so booking still works.
 */
@Component
@Slf4j
public class SystemConfigClient {

    private final RestTemplate restTemplate;
    private final String configUrl;

    public SystemConfigClient(
            @Value("${system.config.url:http://localhost:8080/identity/api/v1/config/public}") String configUrl) {
        this.restTemplate = new RestTemplate();
        this.configUrl = configUrl;
    }

    @SuppressWarnings("unchecked")
    public Map<String, String> fetchPublicConfig() {
        try {
            ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                    configUrl, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, Object>>() {});
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                Map<String, Object> body = resp.getBody();
                if (body.containsKey("result") && body.get("result") instanceof Map) {
                    return (Map<String, String>) body.get("result");
                }
                Map<String, String> flat = new HashMap<>();
                for (Map.Entry<String, Object> entry : body.entrySet()) {
                    flat.put(entry.getKey(), entry.getValue() != null ? entry.getValue().toString() : null);
                }
                return flat;
            }
        } catch (Exception e) {
            log.warn("Could not fetch system config from {}: {} — using defaults", configUrl, e.getMessage());
        }
        return new HashMap<>();
    }

    public int getInt(String key, int defaultValue) {
        Map<String, String> cfg = fetchPublicConfig();
        try {
            String val = cfg.get(key);
            return val != null ? Integer.parseInt(val.trim()) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public boolean getBool(String key, boolean defaultValue) {
        Map<String, String> cfg = fetchPublicConfig();
        String val = cfg.get(key);
        return val != null ? Boolean.parseBoolean(val.trim()) : defaultValue;
    }

    public String getString(String key, String defaultValue) {
        Map<String, String> cfg = fetchPublicConfig();
        String val = cfg.get(key);
        return (val != null && !val.isBlank()) ? val.trim() : defaultValue;
    }
}
