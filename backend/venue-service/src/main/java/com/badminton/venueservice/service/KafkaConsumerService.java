package com.badminton.venueservice.service;

import com.badminton.common.dto.event.OnboardingEvent;
import com.badminton.venueservice.dto.OnboardVenueRequest;
import com.badminton.venueservice.dto.FlexiblePriceDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final VenueService venueService;

    @KafkaListener(topics = "partner-onboarding", groupId = "venue-group")
    public void consumeOnboardingEvent(OnboardingEvent event) {
        log.info("Received onboarding event from Kafka: {}", event);

        try {
            // Mapping Event sang OnboardVenueRequest
            OnboardVenueRequest request = OnboardVenueRequest.builder()
                    .venueName(event.getVenueName())
                    .address(event.getAddress())
                    .city(event.getCity())
                    .courtCount(event.getCourtCount())
                    .utilities(event.getUtilities())
                    .latitude(event.getLatitude())
                    .longitude(event.getLongitude())
                    .openTime(LocalTime.parse(event.getOpenTime()))
                    .closeTime(LocalTime.parse(event.getCloseTime()))
                    .pricing(event.getPricing() != null ? event.getPricing().stream()
                            .map(p -> FlexiblePriceDTO.builder()
                                    .from(LocalTime.parse(p.getFrom()))
                                    .to(LocalTime.parse(p.getTo()))
                                    .price(p.getPrice())
                                    .build())
                            .collect(Collectors.toList()) : null)
                    .build();

            // Gọi logic onboard venue
            venueService.onboardVenue(UUID.fromString(event.getUserId()), request);
            
            log.info("Successfully onboarded venue for owner {} via Kafka", event.getUserId());
        } catch (Exception e) {
            log.error("Error processing onboarding event: {}", e.getMessage(), e);
            // Ở đây có thể triển khai logic retry hoặc gửi message lỗi qua Kafka cho Identity Service
        }
    }
}
