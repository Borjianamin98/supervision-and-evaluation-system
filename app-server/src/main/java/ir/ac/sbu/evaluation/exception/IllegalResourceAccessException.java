package ir.ac.sbu.evaluation.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class IllegalResourceAccessException extends RuntimeException {

    public IllegalResourceAccessException(String message) {
        super(message);
    }
}
