package ir.ac.sbu.evaluation.security;

import io.jsonwebtoken.Claims;
import ir.ac.sbu.evaluation.controller.ApiPaths;
import ir.ac.sbu.evaluation.exception.InvalidJwtTokenException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;
    private final RequestMatcher isAuthPathRequestMatcher =
            new AntPathRequestMatcher(ApiPaths.API_AUTHENTICATION_ROOT_PATH + "/**");

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return isAuthPathRequestMatcher.matches(request);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        extractJwtToken(request).ifPresent(token -> handleJwtToken(request, token));
        chain.doFilter(request, response);
    }

    private Optional<String> extractJwtToken(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null
                || !authHeader.startsWith(AUTHORIZATION_BEARER_PREFIX)
                || authHeader.length() <= AUTHORIZATION_BEARER_PREFIX.length()) {
            // No JWT token found in request headers.
            return Optional.empty();
        }
        // JWT token is in the form "Bearer token". Remove "Bearer" word and get only the token.
        return Optional.of(authHeader.substring(AUTHORIZATION_BEARER_PREFIX.length()));
    }

    private void handleJwtToken(HttpServletRequest request, String token) {
        try {
            Claims tokenClaims = jwtTokenProvider.parseToken(token);
            jwtTokenProvider.ensureIsAccessToken(tokenClaims);
            setSpringSecurityAuthentication(request,
                    jwtTokenProvider.getUserId(tokenClaims),
                    jwtTokenProvider.getUsername(tokenClaims),
                    jwtTokenProvider.getRoles(tokenClaims));
        } catch (InvalidJwtTokenException e) {
            logger.warn(e.getMessage());
        }
    }

    private void setSpringSecurityAuthentication(HttpServletRequest request, long userId, String username,
            List<String> roles) {
        AuthUserDetail authUserDetail = AuthUserDetail.builder()
                .userId(userId)
                .username(username)
                .roles(roles)
                .build();
        // Manually provided authentication for Spring Security.
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(authUserDetail, null, authUserDetail.getAuthorities());
        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        // After setting the Authentication in the context, we specify that the current user is authenticated.
        // So it passes the Spring Security configurations successfully.
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }

}