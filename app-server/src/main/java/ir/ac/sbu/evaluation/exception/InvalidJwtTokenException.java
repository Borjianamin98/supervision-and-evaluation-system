package ir.ac.sbu.evaluation.exception;

public class InvalidJwtTokenException extends Exception {

    public InvalidJwtTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
