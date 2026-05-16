package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourtAvailabilityRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> availableSlots; // e.g., ["05:00", "05:30", "06:00"]
}
