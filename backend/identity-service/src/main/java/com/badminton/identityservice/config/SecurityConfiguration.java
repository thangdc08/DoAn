package com.badminton.identityservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  @Value("${jwt.signerKey}")
  private String signerKey;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authorizeHttpRequest -> authorizeHttpRequest
            .requestMatchers(
                "/actuator/**",
                "/api/v1/auth/login",
                "/api/v1/auth/google",
                "/api/v1/auth/register",
                "/api/v1/auth/register-owner",
                "/api/v1/auth/signup",
                "/api/v1/auth/refresh",
                "/api/v1/auth/logout",
                "/api/v1/users/*/email",
"/api/v1/internal/staff/sync",
                "/api-docs",
                "/api-docs/**",
                "/v3/api-docs",
                "/v3/api-docs/**",
                "/api/v1/config/public",
                "/swagger-ui/**",
                "/swagger-ui.html"
            ).permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt.decoder(apiJwtDecoder()))
        )
        .formLogin(form -> form.disable())
        .build();
  }

  @Bean
  @Primary
  public JwtDecoder apiJwtDecoder() {
    SecretKeySpec secretKey = new SecretKeySpec(signerKey.getBytes(), "HmacSHA256");
    return NimbusJwtDecoder.withSecretKey(secretKey).build();
  }
}
