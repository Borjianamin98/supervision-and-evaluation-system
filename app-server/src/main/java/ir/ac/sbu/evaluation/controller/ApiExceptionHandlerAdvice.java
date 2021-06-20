package ir.ac.sbu.evaluation.controller;

import ir.ac.sbu.evaluation.exception.api.ApiError;
import ir.ac.sbu.evaluation.exception.api.ApiException;
import java.time.Instant;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class ApiExceptionHandlerAdvice extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Object> handleApiExceptions(ApiException apiException, WebRequest request) {
        return buildApiError(apiException, HttpHeaders.EMPTY, apiException.getStatusCode(), request,
                apiException.getEnMessage(), apiException.getFaMessage());
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex,
            Object body,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return buildApiError(ex, headers, status, request);
    }

    private ResponseEntity<Object> buildApiError(Exception exception,
            HttpHeaders headers, HttpStatus httpStatus, WebRequest request) {
        return buildApiError(exception, headers, httpStatus, request, exception.getMessage(),
                "درخواست مربوطه با خطا مواجه شد.");
    }

    private ResponseEntity<Object> buildApiError(Exception exception, HttpHeaders headers, HttpStatus httpStatus,
            WebRequest request, String enMessage, String faMessage) {
        ApiError apiError = ApiError.builder()
                .status(httpStatus.value())
                .exception(exception.getClass().getSimpleName())
                .detail(exception.getMessage())
                .apiPath(((ServletWebRequest) request).getRequest().getRequestURI())
                .httpMethod(((ServletWebRequest) request).getRequest().getMethod())
                .timestamp(Instant.now())
                .enMessage(enMessage)
                .faMessage(faMessage)
                .build();
        return ResponseEntity.status(httpStatus)
                .headers(headers)
                .body(apiError);
    }
}