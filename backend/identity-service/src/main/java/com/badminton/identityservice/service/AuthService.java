package com.badminton.identityservice.service;

import com.badminton.identityservice.dto.request.LoginRequest;
import com.badminton.identityservice.dto.request.LogoutRequest;
import com.badminton.identityservice.dto.request.RefreshTokenRequest;
import com.badminton.identityservice.dto.request.RegisterRequest;
import com.badminton.identityservice.dto.response.LoginResponse;

public interface AuthService {
    String register(RegisterRequest request);
    LoginResponse login(LoginRequest request);

    /**
     * Dùng refresh token để lấy access token mới + refresh token mới (rotation).
     * Refresh token cũ bị revoke ngay sau khi dùng.
     */
    LoginResponse refresh(RefreshTokenRequest request);

    /**
     * Revoke refresh token → user bị logout.
     * Access token vẫn còn hiệu lực đến hết TTL (stateless), client phải tự xóa.
     */
    void logout(LogoutRequest request);
}
