package com.badminton.common.exception;

import com.badminton.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllException(Exception ex) {
        log.error("Unhandled Exception: ", ex);
        ApiResponse<Object> res = new ApiResponse<>();
        res.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage("Lỗi hệ thống vui lòng thử lại");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
        ApiResponse<Object> res = new ApiResponse<>();
        res.setCode(ex.getStatus().value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(ex.getStatus()).body(res);
    }

    @ExceptionHandler(value = {
            org.springframework.web.bind.MissingRequestHeaderException.class,
            org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleBadRequestException(Exception ex) {
        ApiResponse<Object> res = new ApiResponse<>();
        res.setCode(HttpStatus.BAD_REQUEST.value());
        res.setMessage("Tham số yêu cầu không hợp lệ hoặc thiếu thông tin xác thực");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(value = NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNoResourceFoundException(NoResourceFoundException ex) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(HttpStatus.NOT_FOUND.value());
        response.setMessage("Đường dẫn không tồn tại: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> validationError(MethodArgumentNotValidException exception) {
        BindingResult result = exception.getBindingResult();
        final List<FieldError> fieldErrors = result.getFieldErrors();

        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(HttpStatus.BAD_REQUEST.value());

        List<String> errors = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        response.setMessage(errors.size() > 1 ? String.join(", ", errors) : errors.get(0));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(value = DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(HttpStatus.CONFLICT.value());
        response.setMessage("Vi phạm ràng buộc dữ liệu: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
}
