package com.badminton.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class AppException extends RuntimeException {
    private HttpStatusCode status;
    private String message;

    public AppException(HttpStatusCode status, String message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
