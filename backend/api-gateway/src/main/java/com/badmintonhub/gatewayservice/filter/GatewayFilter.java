package com.badmintonhub.gatewayservice.filter;

import com.badmintonhub.gatewayservice.utils.CustomHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;

@Component
public class GatewayFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(context -> context.getAuthentication())
                .filter(auth -> auth instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .flatMap(auth -> {
                    Jwt jwt = auth.getToken();
                    String userId = jwt.getClaimAsString("userId");
                    if (userId == null) {
                        userId = jwt.getId(); // Fallback to jti if userId claim is missing
                    }
                    String scope = jwt.getClaimAsString("scope");

                    System.out.println("GatewayFilter [SecurityContext]: userId=" + userId + ", scope=" + scope);

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                    .header(CustomHeaders.X_AUTH_USER_ID, userId)
                                    .header(CustomHeaders.X_AUTH_USER_AUTHORITIES, scope)
                                    .build())
                            .build();
                    return chain.filter(mutatedExchange);
                })
                .switchIfEmpty(chain.filter(exchange))
                .onErrorResume(e -> {
                    System.err.println("GatewayFilter SecurityContext Error: " + e.getMessage());
                    return chain.filter(exchange);
                });
    }
}
