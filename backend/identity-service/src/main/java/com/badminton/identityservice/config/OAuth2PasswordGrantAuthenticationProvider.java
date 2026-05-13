package com.badminton.identityservice.config;

import com.badminton.identityservice.utils.OAuth2Utils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AccessTokenAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContextHolder;
import org.springframework.security.oauth2.server.authorization.token.DefaultOAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.util.CollectionUtils;

import java.security.Principal;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Custom AuthenticationProvider để xử lý Password Grant Type trong OAuth2.
 *
 * Mục đích:
 * - Cho phép user (customer hoặc admin) đăng nhập bằng username + password
 * - Sinh access token và refresh token nếu hợp lệ
 * - Lưu thông tin authorization vào OAuth2AuthorizationService
 */
public class OAuth2PasswordGrantAuthenticationProvider implements AuthenticationProvider {

    // Service để lưu/truy xuất thông tin authorization
    private final OAuth2AuthorizationService authorizationService;

    // Dùng để sinh access token và refresh token
    private final OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator;

    // Dùng để xác thực username/password (thường kết nối với UserDetailsService)
    private final AuthenticationManager authenticationManager;

    public OAuth2PasswordGrantAuthenticationProvider(
            OAuth2AuthorizationService authorizationService,
            OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator,
            AuthenticationManager authenticationManager) {
        this.authorizationService = authorizationService;
        this.tokenGenerator = tokenGenerator;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // Ép kiểu Authentication thành token của Password Grant
        OAuth2PasswordGrantAuthenticationToken passwordGrantAuthenticationToken =
                (OAuth2PasswordGrantAuthenticationToken) authentication;

        // 1️⃣ Xác thực client (ứng dụng) gọi API token
        OAuth2ClientAuthenticationToken clientPrincipal =
                OAuth2Utils.getAuthenticatedClientElseThrowInvalidClient(passwordGrantAuthenticationToken);

        // Lấy thông tin client đã đăng ký
        RegisteredClient registeredClient = clientPrincipal.getRegisteredClient();

        // 2️⃣ Kiểm tra client có được phép dùng password grant không
        if (registeredClient == null ||
                !registeredClient.getAuthorizationGrantTypes()
                        .contains(passwordGrantAuthenticationToken.getGrantType())) {
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.UNAUTHORIZED_CLIENT);
        }

        // 3️⃣ Kiểm tra scope yêu cầu có hợp lệ không
        Set<String> authorizedScopes = Collections.emptySet();
        if (!CollectionUtils.isEmpty(passwordGrantAuthenticationToken.getScopes())) {
            passwordGrantAuthenticationToken.getScopes().forEach(scope -> {
                if (!registeredClient.getScopes().contains(scope)) {
                    throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_SCOPE);
                }
            });
            authorizedScopes = new HashSet<>(passwordGrantAuthenticationToken.getScopes());
        }

        // 4️⃣ Xác thực username/password của user
        String username = passwordGrantAuthenticationToken.getUsername();
        String password = passwordGrantAuthenticationToken.getPassword();

        Authentication credentialsAuthentication;
        try {
            credentialsAuthentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
        } catch (AuthenticationException e) {
            throw new OAuth2AuthenticationException(OAuth2ErrorCodes.UNAUTHORIZED_CLIENT);
        }

        // 5️⃣ Lưu thông tin user đã xác thực vào SecurityContext
        OAuth2ClientAuthenticationToken oAuth2ClientAuthenticationToken =
                (OAuth2ClientAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        oAuth2ClientAuthenticationToken.setDetails(credentialsAuthentication.getPrincipal());
        SecurityContextHolder.getContext().setAuthentication(oAuth2ClientAuthenticationToken);

        // 6️⃣ Tạo token context để sinh Access Token
        DefaultOAuth2TokenContext.Builder tokenContextBuilder = DefaultOAuth2TokenContext.builder()
                .registeredClient(registeredClient)
                .principal(clientPrincipal) // client
                .authorizationServerContext(AuthorizationServerContextHolder.getContext())
                .authorizedScopes(authorizedScopes)
                .authorizationGrantType(passwordGrantAuthenticationToken.getGrantType())
                .authorizationGrant(passwordGrantAuthenticationToken);

        // Sinh Access Token
        DefaultOAuth2TokenContext tokenContext = tokenContextBuilder
                .tokenType(OAuth2TokenType.ACCESS_TOKEN)
                .build();
        OAuth2Token generatedAccessToken = tokenGenerator.generate(tokenContext);
        if (generatedAccessToken == null) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error(OAuth2ErrorCodes.SERVER_ERROR,
                            "The token generator failed to generate the access token.",
                            OAuth2Utils.ACCESS_TOKEN_REQUEST_ERROR_URI));
        }

        // Đóng gói Access Token
        OAuth2AccessToken accessToken = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                generatedAccessToken.getTokenValue(),
                generatedAccessToken.getIssuedAt(),
                generatedAccessToken.getExpiresAt(),
                tokenContext.getAuthorizedScopes()
        );

        // 7️⃣ Tạo builder lưu Authorization
        OAuth2Authorization.Builder authorizationBuilder = OAuth2Authorization
                .withRegisteredClient(registeredClient)
                .attribute(Principal.class.getName(), clientPrincipal)
                .principalName(clientPrincipal.getName())
                .authorizationGrantType(passwordGrantAuthenticationToken.getGrantType())
                .authorizedScopes(authorizedScopes);

        if (generatedAccessToken instanceof ClaimAccessor) {
            authorizationBuilder.token(accessToken, (metadata) ->
                    metadata.put(OAuth2Authorization.Token.CLAIMS_METADATA_NAME,
                            ((ClaimAccessor) generatedAccessToken).getClaims()));
        } else {
            authorizationBuilder.accessToken(accessToken);
        }

        // 8️⃣ Sinh Refresh Token nếu client cho phép
        OAuth2RefreshToken refreshToken = null;
        if (registeredClient.getAuthorizationGrantTypes().contains(AuthorizationGrantType.REFRESH_TOKEN) &&
                !clientPrincipal.getClientAuthenticationMethod().equals(ClientAuthenticationMethod.NONE)) {

            tokenContext = tokenContextBuilder.tokenType(OAuth2TokenType.REFRESH_TOKEN).build();
            OAuth2Token generatedRefreshToken = tokenGenerator.generate(tokenContext);

            if (!(generatedRefreshToken instanceof OAuth2RefreshToken)) {
                throw new OAuth2AuthenticationException(new OAuth2Error(OAuth2ErrorCodes.SERVER_ERROR,
                        "The token generator failed to generate the refresh token.",
                        OAuth2Utils.ACCESS_TOKEN_REQUEST_ERROR_URI));
            }

            refreshToken = new OAuth2RefreshToken(
                    generatedRefreshToken.getTokenValue(),
                    generatedRefreshToken.getIssuedAt(),
                    generatedRefreshToken.getExpiresAt()
            );
            authorizationBuilder.refreshToken(refreshToken);
        }

        // 9️⃣ Lưu thông tin Authorization vào DB
        OAuth2Authorization authorization = authorizationBuilder.build();
        authorizationService.save(authorization);

        // 🔟 Trả về kết quả gồm Access Token và Refresh Token
        return new OAuth2AccessTokenAuthenticationToken(
                registeredClient, clientPrincipal, accessToken, refreshToken);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OAuth2PasswordGrantAuthenticationToken.class.isAssignableFrom(authentication);
    }
}


