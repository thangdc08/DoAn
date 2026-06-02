package com.badminton.notificationservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class IdentityServiceClient {

    private final RestTemplate restTemplate;

    public String getUserEmail(UUID userId) {
        try {
            String url = "http://identity-service/api/v1/users/" + userId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("email")) {
                return (String) response.get("email");
            }
        } catch (Exception e) {
            log.error("Failed to fetch email for user {} from identity-service", userId, e);
        }
        return null;
    }
}
