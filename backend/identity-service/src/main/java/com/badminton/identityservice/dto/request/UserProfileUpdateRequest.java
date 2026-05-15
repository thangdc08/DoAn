package com.badminton.identityservice.dto.request;

import com.badminton.identityservice.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileUpdateRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    
    private Gender gender;
    private String level;
    private String goal;
    private String bio;
    
    private String avatarUrl;
    private List<String> preferredAreas;
    private List<UserAvailabilityRequest> availabilities;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserAvailabilityRequest {
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
