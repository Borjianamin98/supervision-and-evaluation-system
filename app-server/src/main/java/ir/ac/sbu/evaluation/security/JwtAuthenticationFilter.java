package ir.ac.sbu.evaluation.security;

import ir.ac.sbu.evaluation.exception.InvalidJwtTokenException;
import ir.ac.sbu.evaluation.service.UserService;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        extractJwtToken(request);
        chain.doFilter(request, response);
    }

    private void extractJwtToken(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // No JWT token found in request headers.
            return;
        }

        // JWT token is in the form "Bearer token". Remove "Bearer" word and get only the token.
        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtTokenProvider.getSubjectFromToken(token);
        } catch (InvalidJwtTokenException e) {
            logger.warn("Invalid JWT token found in request headers: error = " + e.getMessage());
            return;
        }

        // Find user provided by JWT token to validate its existence.
        UserDetails userDetails;
        try {
            userDetails = userService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            logger.warn("Skip JWT token because username is not valid anymore: error = " + e.getMessage());
            return;
        }

        // Manually provided authentication for Spring Security.
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        // After setting the Authentication in the context, we specify that the current user is authenticated.
        // So it passes the Spring Security configurations successfully.
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }

}