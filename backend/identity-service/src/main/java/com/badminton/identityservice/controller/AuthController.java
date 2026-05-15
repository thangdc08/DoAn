package com.badminton.identityservice.controller;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.identityservice.dto.request.LoginRequest;
import com.badminton.identityservice.dto.request.LogoutRequest;
import com.badminton.identityservice.dto.request.RefreshTokenRequest;
import com.badminton.identityservice.dto.request.RegisterRequest;
import com.badminton.identityservice.dto.response.LoginResponse;
import com.badminton.identityservice.service.AuthService;
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
}
