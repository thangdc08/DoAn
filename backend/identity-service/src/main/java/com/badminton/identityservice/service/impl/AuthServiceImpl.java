package com.badminton.identityservice.service.impl;

import com.badminton.common.exception.AppException;
import com.badminton.identityservice.client.VenueClient;
import com.badminton.identityservice.dto.model.UserDTO;
import com.badminton.identityservice.dto.request.GoogleLoginRequest;
import com.badminton.identityservice.dto.request.LoginRequest;
import com.badminton.identityservice.dto.request.LogoutRequest;
import com.badminton.identityservice.dto.request.RefreshTokenRequest;
import com.badminton.identityservice.dto.request.RegisterRequest;
import com.badminton.identityservice.dto.response.LoginResponse;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import com.badminton.identityservice.entity.RefreshToken;
import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.entity.UserStatus;
import com.badminton.identityservice.repository.RefreshTokenRepository;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserRepository;
import com.badminton.identityservice.security.JwtTokenProvider;
import com.badminton.identityservice.service.AuthService;
import com.badminton.identityservice.service.KafkaProducerService;
import com.badminton.common.dto.event.OnboardingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;
  private final RefreshTokenRepository refreshTokenRepository;
  private final org.modelmapper.ModelMapper modelMapper;
  private final KafkaProducerService kafkaProducerService;
  private final VenueClient venueClient;

  @Value("${jwt.refreshable-duration}")
  private long refreshableDuration;

  // ─────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────

  @Override
  public UserDTO register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
    }
    if (userRepository.existsByPhone(request.getPhone())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
    }

    Role userRole = roleRepository.findByCode("USER")
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"));

    User user = User.builder()
        .email(request.getEmail())
        .phone(request.getPhone())
        .fullName(request.getFullName())
        .level(request.getLevel())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .status(UserStatus.ACTIVE)
        .roles(new HashSet<>(Set.of(userRole)))
        .build();

    user = userRepository.save(user);

    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    userDTO.setRoles(user.getRoles().stream().map(Role::getCode).collect(Collectors.toSet()));

    return userDTO;
  }

  @Override
  @Transactional
  public LoginResponse registerOwner(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
    }
    if (userRepository.existsByPhone(request.getPhone())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
    }

    Role ownerRole = roleRepository.findByCode("OWNER")
        .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò OWNER"));

    User user = User.builder()
        .email(request.getEmail())
        .phone(request.getPhone())
        .fullName(request.getFullName())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .status(UserStatus.ACTIVE)
        .roles(new HashSet<>(Set.of(ownerRole)))
        .build();

    user = userRepository.save(user);

    // Bắn event qua Kafka để Venue Service xử lý tạo sân
    OnboardingEvent event = OnboardingEvent.builder()
        .userId(user.getId().toString())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .phoneNumber(user.getPhone())
        .venueName(request.getVenueName())
        .address(request.getAddress())
        .ward(request.getWard())
        .city(request.getCity())
        .courtCount(request.getCourtCount())
        .utilities(request.getUtilities())
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .openTime(request.getOpenTime())
        .closeTime(request.getCloseTime())
        .pricing(request.getPricing() != null ? request.getPricing().stream()
            .map(p -> OnboardingEvent.PricingRuleEvent.builder()
                .from(p.getFrom())
                .to(p.getTo())
                .price(p.getPrice())
                .build())
            .collect(Collectors.toList()) : null)
        .build();
    kafkaProducerService.sendOnboardingEvent(event);

    String accessToken = jwtTokenProvider.generateToken(user);
    String rawRefreshToken = issueRefreshToken(user);

    return buildLoginResponse(accessToken, rawRefreshToken, user);
  }

  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────

  @Override
  @Transactional
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmailOrPhoneWithRoles(request.getEmail())
        .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Mật khẩu không chính xác");
    }

    if (user.getStatus() == UserStatus.LOCKED) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị khóa");
    }

    String extraScope = checkStaffScope(user.getId());
    String accessToken = jwtTokenProvider.generateToken(user, extraScope);
    String rawRefreshToken = issueRefreshToken(user);

    return buildLoginResponse(accessToken, rawRefreshToken, user);
  }

  @Override
  @Transactional
  public LoginResponse googleLogin(GoogleLoginRequest request) {
    String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken();
    RestTemplate restTemplate = new RestTemplate();
    Map<String, Object> payload;
    try {
      payload = restTemplate.getForObject(url, Map.class);
    } catch (Exception e) {
      throw new AppException(HttpStatus.UNAUTHORIZED,
          "Xác thực tài khoản Google thất bại: Token không hợp lệ hoặc đã hết hạn");
    }

    if (payload == null || payload.containsKey("error")) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Xác thực tài khoản Google thất bại: Token không hợp lệ");
    }

    String email = (String) payload.get("email");
    String fullName = (String) payload.get("name");

    if (email == null) {
      throw new AppException(HttpStatus.BAD_REQUEST, "Không thể lấy email từ tài khoản Google");
    }

    User user = userRepository.findByEmailOrPhoneWithRoles(email)
        .orElseGet(() -> {
          // Tạo tài khoản mới nếu chưa tồn tại
          Role userRole = roleRepository.findByCode("USER")
              .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò USER"));

          // Tạo mật khẩu ngẫu nhiên cho người dùng Google
          String randomPassword = Base64.getUrlEncoder().withoutPadding().encodeToString(new byte[16]);

          User newUser = User.builder()
              .email(email)
              .fullName(fullName != null ? fullName : email.split("@")[0])
              .passwordHash(passwordEncoder.encode(randomPassword))
              .status(UserStatus.ACTIVE)
              .roles(new HashSet<>(Set.of(userRole)))
              .build();
          return userRepository.save(newUser);
        });

    if (user.getStatus() == UserStatus.LOCKED) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Tài khoản đã bị khóa");
    }

    String extraScope = checkStaffScope(user.getId());
    String accessToken = jwtTokenProvider.generateToken(user, extraScope);
    String rawRefreshToken = issueRefreshToken(user);

    return buildLoginResponse(accessToken, rawRefreshToken, user);
  }

  // ─────────────────────────────────────────────
  // Refresh — Token Rotation
  // ─────────────────────────────────────────────

  @Override
  @Transactional
  public LoginResponse refresh(RefreshTokenRequest request) {
    String tokenHash = sha256(request.getRefreshToken());

    RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn"));

    // Kiểm tra đã bị revoke chưa
    if (stored.getRevokedAt() != null) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Token đã bị thu hồi");
    }

    // Kiểm tra hết hạn chưa
    if (stored.getExpiresAt().isBefore(OffsetDateTime.now())) {
      throw new AppException(HttpStatus.UNAUTHORIZED, "Token đã hết hạn");
    }

    // Revoke token cũ ngay lập tức (Token Rotation — bảo vệ khỏi replay attack)
    stored.setRevokedAt(OffsetDateTime.now());
    refreshTokenRepository.save(stored);

    // Sinh cặp token mới
    User user = stored.getUser();
    String extraScope = checkStaffScope(user.getId());
    String newAccessToken = jwtTokenProvider.generateToken(user, extraScope);
    String newRawRefreshToken = issueRefreshToken(user);

    return buildLoginResponse(newAccessToken, newRawRefreshToken, user);
  }

  // ─────────────────────────────────────────────
  // Logout — Revoke refresh token
  // ─────────────────────────────────────────────

  @Override
  @Transactional
  public void logout(LogoutRequest request) {
    String tokenHash = sha256(request.getRefreshToken());

    RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash).orElse(null);
    if (stored != null && stored.getRevokedAt() == null) {
      stored.setRevokedAt(OffsetDateTime.now());
      refreshTokenRepository.save(stored);
    }
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  private String checkStaffScope(UUID userId) {
    try {
      com.badminton.common.dto.ApiResponse<List<Map<String, Object>>> resp = venueClient
          .getVenuesByOwner(userId.toString(), userId.toString());
      if (resp != null && resp.getResult() != null) {
        boolean isStaff = resp.getResult().stream().anyMatch(v -> {
          String role = (String) v.get("currentUserRole");
          return role != null && !role.equals("Owner");
        });
        if (isStaff) {
          return "STAFF";
        }
      }
    } catch (Exception e) {
      log.warn("Failed to check staff scope for user {}: {}", userId, e.getMessage());
    }
    return null;
  }

  private LoginResponse buildLoginResponse(String accessToken, String refreshToken, User user) {
    LoginResponse response = new LoginResponse();
    response.setAccessToken(accessToken);
    response.setRefreshToken(refreshToken);
    response.setTokenType("Bearer");
    response.setExpiresIn(86400L);

    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    userDTO.setRoles(user.getRoles().stream().map(Role::getCode).collect(Collectors.toSet()));
    response.setUser(userDTO);

    return response;
  }

  private String issueRefreshToken(User user) {
    String rawToken = UUID.randomUUID().toString();
    String tokenHash = sha256(rawToken);

    RefreshToken refreshToken = RefreshToken.builder()
        .user(user)
        .tokenHash(tokenHash)
        .expiresAt(OffsetDateTime.now().plusSeconds(refreshableDuration))
        .build();

    refreshTokenRepository.save(refreshToken);
    return rawToken;
  }

  private String sha256(String raw) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
      return Base64.getEncoder().encodeToString(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("SHA-256 not supported", e);
    }
  }
}
