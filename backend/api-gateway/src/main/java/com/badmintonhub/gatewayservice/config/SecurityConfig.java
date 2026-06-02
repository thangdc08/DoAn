package com.badmintonhub.gatewayservice.config;

import com.badmintonhub.gatewayservice.exception.AccessDeniedExceptionHandler;
import com.badmintonhub.gatewayservice.exception.AuthenticationExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${jwt.signerKey}")
    private String signerKey;

    private final ObjectMapper objectMapper;

    public SecurityConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * ReactiveJwtDecoder — đúng type cho Spring WebFlux (gateway dùng WebFlux).
     * Dùng HMAC-SHA256 với secret key giống identity-service.
     */
    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        SecretKeySpec secretKey = new SecretKeySpec(signerKey.getBytes(), "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    @Bean
    public AuthenticationExceptionHandler authenticationExceptionHandler() {
        return new AuthenticationExceptionHandler(objectMapper);
    }

    @Bean
    public AccessDeniedExceptionHandler accessDeniedExceptionHandler() {
        return new AccessDeniedExceptionHandler(objectMapper);
    }

    @Bean
    CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.applyPermitDefaultValues();
        corsConfig.setAllowedOrigins(Collections.singletonList("*"));
        corsConfig.setAllowedMethods(Collections.singletonList("*"));
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(auth -> auth
                        // Public — docs
                        .pathMatchers(
                                "/actuator/**",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/openapi/**",
                                "/identity/v3/api-docs/**",
                                "/identity/swagger-ui/**",
                                "/identity/swagger-ui.html",
                                "/webjars/**",
                                "/venues/api-docs/**",
                                "/venues/v3/api-docs/**",
                                "/bookings/api-docs/**",
                                "/bookings/v3/api-docs/**"
                        ).permitAll()
                        // Public — auth endpoints (không cần token)
                        .pathMatchers(HttpMethod.POST, "/identity/api/v1/auth/login").permitAll()
                        .pathMatchers(HttpMethod.POST, "/identity/api/v1/auth/register").permitAll()
                        .pathMatchers(HttpMethod.POST, "/identity/api/v1/auth/register-owner").permitAll()
                        .pathMatchers(HttpMethod.POST, "/identity/api/v1/auth/refresh").permitAll()
                        .pathMatchers(HttpMethod.POST, "/identity/api/v1/auth/logout").permitAll()
                        // Venue Onboarding & Management — Owner & Admin
                        .pathMatchers(HttpMethod.POST, "/venues/api/venues/*/ratings").hasAnyAuthority("SCOPE_USER", "SCOPE_OWNER", "SCOPE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/venues/api/venues/ratings/upload-images").hasAnyAuthority("SCOPE_USER", "SCOPE_OWNER", "SCOPE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/venues/api/v1/venues/onboard").hasAuthority("SCOPE_OWNER")
                        .pathMatchers(HttpMethod.GET, "/venues/api/venues/my").hasAnyAuthority("SCOPE_OWNER", "SCOPE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/venues/**").hasAnyAuthority("SCOPE_OWNER", "SCOPE_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/venues/**").hasAnyAuthority("SCOPE_OWNER", "SCOPE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/venues/**").hasAnyAuthority("SCOPE_OWNER", "SCOPE_ADMIN")

                        // Public — read-only venue, booking & community
                        .pathMatchers(HttpMethod.GET, "/venues/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/bookings/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/communities/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/payments/api/payments/vnpay/callback").permitAll()
                        .pathMatchers(HttpMethod.GET, "/payments/api/payments/vnpay/ipn").permitAll()
                        // Admin only
                        .pathMatchers("/identity/admin/**").hasAuthority("SCOPE_ADMIN")
                        // Tất cả còn lại phải authenticated
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(authenticationExceptionHandler())
                        .accessDeniedHandler(accessDeniedExceptionHandler())
                        .jwt(jwt -> jwt.jwtDecoder(reactiveJwtDecoder()))
                )
                .build();
    }
}
