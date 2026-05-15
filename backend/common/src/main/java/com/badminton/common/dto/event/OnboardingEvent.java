package com.badminton.common.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OnboardingEvent {
    // User Info
    private String userId;
    private String email;
    private String fullName;

    // Venue Info
    private String venueName;
    private String address;
    private String city;
    private Integer courtCount;
    private List<String> utilities;
    private Double latitude;
    private Double longitude;
    private String openTime;
    private String closeTime;
    private List<PricingRuleEvent> pricing;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PricingRuleEvent {
        private String from;
        private String to;
        private BigDecimal price;
    }
}
