package com.badminton.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyTicketRequest {
    @NotBlank
    private String reply;
}
