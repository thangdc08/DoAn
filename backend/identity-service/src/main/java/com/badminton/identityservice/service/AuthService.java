package com.badminton.identityservice.service;

import com.badminton.identityservice.config.JwtService;
import com.badminton.identityservice.dto.AuthResponse;
import com.badminton.identityservice.dto.LoginRequest;
import com.badminton.identityservice.dto.RegisterRequest;
import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.entity.UserProfile;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserProfileRepository;
import com.badminton.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role userRole = roleRepository.findByCode("USER")
                .orElseGet(() -> roleRepository.save(Role.builder().code("USER").name("User").build()));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(userRole)))
                .build();

        User savedUser = userRepository.save(user);

        userProfileRepository.save(UserProfile.builder()
                .userId(savedUser.getId())
                .build());

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }
}
