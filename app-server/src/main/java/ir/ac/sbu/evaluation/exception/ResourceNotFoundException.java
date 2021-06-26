package ir.ac.sbu.evaluation.exception;

import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        this(message, "منبع مربوطه یافت نشد.");
    }

    public ResourceNotFoundException(String message, String faMessage) {
        super(HttpStatus.NOT_FOUND, message, faMessage);
    }
}
