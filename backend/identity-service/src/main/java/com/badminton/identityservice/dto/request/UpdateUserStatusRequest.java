package com.badminton.identityservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusRequest {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACTIVE|LOCKED", message = "Status must be ACTIVE or LOCKED")
    private String status;
}