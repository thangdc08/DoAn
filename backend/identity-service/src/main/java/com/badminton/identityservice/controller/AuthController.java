package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.request.*;
import com.badminton.identityservice.dto.response.LoginResponse;
import com.badminton.identityservice.service.AuthService;
import com.badminton.identityservice.service.PasswordRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.badminton.identityservice.dto.model.UserDTO;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordRecoveryService passwordRecoveryService;

    @ApiMessage("Đăng ký tài khoản")
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @ApiMessage("Đăng ký chủ sân")
    @PostMapping("/register-owner")
    public ResponseEntity<LoginResponse> registerOwner(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerOwner(request));
    }

    @ApiMessage("Đăng nhập tài khoản")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @ApiMessage("Đăng nhập bằng Google")
    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    /**
     * Đổi refresh token lấy cặp token mới (access + refresh).
     * Refresh token cũ bị revoke ngay sau khi dùng (Token Rotation).
     */
    @ApiMessage("Làm mới token")
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    /**
     * Logout — revoke refresh token.
     * Client phải tự xóa access token khỏi bộ nhớ.
     */
    @ApiMessage("Đăng xuất")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Quên mật khẩu - Gửi OTP qua email
     */
    @ApiMessage("Gửi OTP quên mật khẩu")
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        passwordRecoveryService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok().build();
    }

    /**
     * Đặt lại mật khẩu với OTP
     */
    @ApiMessage("Đặt lại mật khẩu")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordRecoveryService.resetPassword(request);
        return ResponseEntity.ok().build();
    }
}
