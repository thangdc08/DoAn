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
public class BookingServiceClient {

    private final RestTemplate restTemplate;

    public UUID getVenueIdForBooking(UUID bookingId) {
        try {
            String url = "http://booking-service/api/bookings/" + bookingId;
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("result")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> result = (Map<String, Object>) response.get("result");
                if (result != null && result.containsKey("venueId")) {
                    return UUID.fromString(result.get("venueId").toString());
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch venueId for booking {} from booking-service", bookingId, e);
        }
        return null;
    }
}
