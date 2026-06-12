package com.badminton.notificationservice.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class VenueServiceClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public boolean isNotificationEnabled(UUID venueId, String notificationKey) {
        try {
            String url = "http://venue-service/api/venues/" + venueId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("result")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> result = (Map<String, Object>) response.get("result");
                if (result != null && result.containsKey("policy")) {
                    String policyStr = (String) result.get("policy");
                    if (policyStr != null && !policyStr.trim().isEmpty()) {
                        JsonNode root = objectMapper.readTree(policyStr);
                        JsonNode notificationsNode = root.path("notifications");
                        if (notificationsNode.isObject() && notificationsNode.has(notificationKey)) {
                            return notificationsNode.get(notificationKey).asBoolean(true);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch notification status for venue {} and key {}", venueId, notificationKey, e);
        }
        // Default to true if not configured or call failed
        return true;
    }

    public UUID getVenueOwnerId(UUID venueId) {
        try {
            String url = "http://venue-service/api/venues/" + venueId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("result")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> result = (Map<String, Object>) response.get("result");
                if (result != null && result.containsKey("ownerId")) {
                    return UUID.fromString(result.get("ownerId").toString());
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch ownerId for venue {}", venueId, e);
        }
        return null;
    }
}
