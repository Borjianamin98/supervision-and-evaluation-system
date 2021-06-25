package ir.ac.sbu.evaluation.exception.api;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus statusCode;
    private final String enMessage;
    private final String faMessage;

    public ApiException(HttpStatus statusCode, String enMessage, String faMessage, Throwable throwable) {
        super(throwable.getMessage());
        this.statusCode = statusCode;
        this.enMessage = enMessage;
        this.faMessage = faMessage;
    }

    public ApiException(HttpStatus statusCode, String enMessage, String faMessage) {
        super(enMessage);
        this.statusCode = statusCode;
        this.enMessage = enMessage;
        this.faMessage = faMessage;
    }

    public HttpStatus getStatusCode() {
        return statusCode;
    }

    public String getEnMessage() {
        return enMessage;
    }

    public String getFaMessage() {
        return faMessage;
    }
}
