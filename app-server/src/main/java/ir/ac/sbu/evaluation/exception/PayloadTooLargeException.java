package ir.ac.sbu.evaluation.exception;

import ir.ac.sbu.evaluation.exception.api.ApiException;
import org.springframework.http.HttpStatus;

public class PayloadTooLargeException extends ApiException {

    public PayloadTooLargeException(String message) {
        this(message, "درخواست ارسالی از حجم بیشینه درخواست مجاز بیش‌تر می‌باشد.");
    }

    public PayloadTooLargeException(String message, String faMessage) {
        super(HttpStatus.PAYLOAD_TOO_LARGE, message, faMessage);
    }
}
