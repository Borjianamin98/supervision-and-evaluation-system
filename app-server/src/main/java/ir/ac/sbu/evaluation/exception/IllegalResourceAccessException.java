package ir.ac.sbu.evaluation.exception;

import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class IllegalResourceAccessException extends ApiException {

    public IllegalResourceAccessException(String message) {
        super(HttpStatus.FORBIDDEN, message, "دسترسی به منبع مربوطه امکان پذیر نمی‌باشد.");
    }

}
