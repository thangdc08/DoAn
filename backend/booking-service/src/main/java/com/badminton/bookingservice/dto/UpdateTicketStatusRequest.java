package com.badminton.bookingservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTicketStatusRequest {
    private String status; // OPEN | IN_PROGRESS | RESOLVED | CLOSED
}
