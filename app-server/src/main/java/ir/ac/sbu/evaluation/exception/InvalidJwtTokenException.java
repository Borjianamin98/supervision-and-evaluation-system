package ir.ac.sbu.evaluation.exception;

import io.jsonwebtoken.JwtException;

public class InvalidJwtTokenException extends Exception {

    private final JwtException cause;

    public InvalidJwtTokenException(String message, JwtException cause) {
        super(message, cause);
        this.cause = cause;
    }

    @Override
    public synchronized JwtException getCause() {
        return cause;
    }
}
