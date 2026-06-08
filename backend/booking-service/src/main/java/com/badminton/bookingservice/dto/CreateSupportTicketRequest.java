package com.badminton.bookingservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSupportTicketRequest {
    @NotBlank
    private String subject;
    @NotBlank
    private String description;
}
