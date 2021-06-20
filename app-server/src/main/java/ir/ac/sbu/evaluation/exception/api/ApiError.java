package ir.ac.sbu.evaluation.exception.api;

import java.time.Instant;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiError {

    private int status;
    private String exception;
    private String detail;
    private String apiPath;
    private String httpMethod;
    private Instant timestamp;
    private String enMessage;
    private String faMessage;

    @Builder
    public ApiError(int status, String exception, String detail, String apiPath, String httpMethod,
            Instant timestamp, String enMessage, String faMessage) {
        this.status = status;
        this.exception = exception;
        this.detail = detail;
        this.apiPath = apiPath;
        this.httpMethod = httpMethod;
        this.timestamp = timestamp;
        this.enMessage = enMessage;
        this.faMessage = faMessage;
    }
}