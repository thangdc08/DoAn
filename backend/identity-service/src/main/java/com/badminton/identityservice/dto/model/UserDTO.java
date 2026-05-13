package com.badminton.identityservice.dto.model;

import com.badminton.identityservice.entity.UserStatus;
import lombok.*;

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
    private String password;
    private UserStatus status;
    private Set<String> roles;
}
