package ir.ac.sbu.evaluation.exception;

import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class ResourceConflictException extends ApiException {

    public ResourceConflictException(String message) {
        this(message, "درخواست مربوط به منبع دارای تضاد با وضعیت فعلی می‌باشد.");
    }

    public ResourceConflictException(String message, String faMessage) {
        super(HttpStatus.CONFLICT, message, faMessage);
    }
}
