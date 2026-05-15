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

@Component
public class GatewayFilter implements GlobalFilter {

    private final ReactiveJwtDecoder jwtDecoder;

    public GatewayFilter(ReactiveJwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
        if (token == null || !token.startsWith("Bearer "))
            return chain.filter(exchange);
        
        return jwtDecoder.decode(token.substring(7))
                .flatMap(jwt -> {
                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                    .header(CustomHeaders.X_AUTH_USER_ID, jwt.getId())
                                    .header(CustomHeaders.X_AUTH_USER_AUTHORITIES,
                                            String.valueOf(jwt.getClaimAsString("scope")))
                                    .build())
                            .build();
                    return chain.filter(mutatedExchange);
                })
                .onErrorResume(e -> chain.filter(exchange)); // Continue without headers if token is invalid
    }
}
