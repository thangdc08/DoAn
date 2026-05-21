package com.badminton.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueStatsResponse {
    private BigDecimal totalRevenue;
    private Integer totalBookings;
    private Integer paidBookings;
    private Integer pendingBookings;
    private Integer failedBookings;
    private LocalDate fromDate;
    private LocalDate toDate;
    private List<VenueRevenue> venueBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VenueRevenue {
        private java.util.UUID venueId;
        private String venueName;
        private BigDecimal revenue;
        private Integer bookingCount;
    }
}