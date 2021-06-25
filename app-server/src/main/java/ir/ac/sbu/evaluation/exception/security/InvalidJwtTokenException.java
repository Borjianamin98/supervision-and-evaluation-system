package ir.ac.sbu.evaluation.exception.security;

import io.jsonwebtoken.JwtException;
import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class InvalidJwtTokenException extends ApiException {

    private final JwtException cause;

    public InvalidJwtTokenException(JwtException cause) {
        super(HttpStatus.UNAUTHORIZED, cause.getMessage(), "دسترسی به منبع مربوطه امکان پذیر نمی‌باشد.", cause);
        this.cause = cause;
    }

    public InvalidJwtTokenException(String message, JwtException cause) {
        super(HttpStatus.UNAUTHORIZED, message, "دسترسی به منبع مربوطه امکان پذیر نمی‌باشد.", cause);
        this.cause = cause;
    }

    @Override
    public synchronized JwtException getCause() {
        return cause;
    }
}
