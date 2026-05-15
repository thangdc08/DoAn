package com.badminton.identityservice.dto.model;

import com.badminton.identityservice.entity.Gender;
import com.badminton.identityservice.entity.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private Gender gender;
    private String level;
    private String goal;
    private String bio;
    private Double rating;
    private Integer reviewCount;
    private UserStatus status;
    private Set<String> roles;

    @JsonIgnore
    private String password;
    
    private List<String> preferredAreas;
    private List<UserAvailabilityDTO> availabilities;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserAvailabilityDTO {
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
