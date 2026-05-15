package com.badminton.identityservice.dto.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {
    private UUID id;

    @NotEmpty(message = "Tên không được bỏ trống")
    @Size(min = 2, message = "Tên phải có độ dài tối thiểu là 2 ký tự")
    private String fullName;

    @NotEmpty(message = "Số điện thoại không được bỏ trống")
    @Size(min = 9, message = "Số điện thoại phải có độ dài tối thiểu là 9 ký tự")
    private String phone;

    @NotEmpty(message = "Trình độ không được bỏ trống")
    @Size(max = 20)
    private String level;
}
