package com.badminton.identityservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 20)
    private String phone;

    @NotBlank(message = "Full name is required")
    @Size(max = 150)
    private String fullName;

    @NotBlank(message = "Level is required")
    @Size(max = 20)
    private String level;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Venue Details (Optional for normal user, required for owner onboarding)
    private String venueName;
    private String address;
    private String city;
    private Integer courtCount;
    private java.util.List<String> utilities;
    private Double latitude;
    private Double longitude;
    private String openTime;
    private String closeTime;
    private java.util.List<PricingRuleRequest> pricing;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PricingRuleRequest {
        private String from;
        private String to;
        private java.math.BigDecimal price;
    }
}
