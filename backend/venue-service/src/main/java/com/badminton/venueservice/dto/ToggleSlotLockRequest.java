package com.badminton.venueservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToggleSlotLockRequest {
    private LocalDate slotDate;
    private String startTime;
    private String endTime;
    private boolean lock;
}
