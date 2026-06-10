package com.badminton.communityservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStatsResponse {
    private long totalMatches;
    private int reliabilityPoints;
    private double averageRating;
    private List<DayMatchStats> performanceData;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayMatchStats {
        private String name;
        private long matches;
    }
}
