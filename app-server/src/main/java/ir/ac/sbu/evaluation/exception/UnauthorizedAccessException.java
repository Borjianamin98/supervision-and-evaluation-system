package ir.ac.sbu.evaluation.exception;

import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class UnauthorizedAccessException extends ApiException {

    public UnauthorizedAccessException(String message) {
        super(HttpStatus.UNAUTHORIZED, message, "دسترسی به منبع مربوطه نیازمند احراز هویت می‌باشد.");
    }

}
