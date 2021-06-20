package ir.ac.sbu.evaluation.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.ac.sbu.evaluation.exception.api.ApiError;
import java.io.IOException;
import java.time.Instant;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        // This is invoked when user tries to access a secured resource without supplying any credentials.
        // We should just send a 401 unauthorized response.
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        ApiError apiError = ApiError.builder()
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .exception(authException.getClass().getSimpleName())
                .detail(authException.getMessage())
                .apiPath(request.getRequestURI())
                .httpMethod(request.getMethod())
                .timestamp(Instant.now())
                .enMessage("Full authentication is required to access this resource")
                .faMessage("دسترسی به منبع مربوطه امکان پذیر نمی‌باشد.")
                .build();
        response.getWriter().write(objectMapper.writeValueAsString(apiError));
    }
}