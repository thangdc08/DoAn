package com.badminton.common.util;

import com.badminton.common.annotation.ApiMessage;
import com.badminton.common.dto.ApiResponse;
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(
            @Nullable Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        ApiResponse<Object> res = new ApiResponse<>();
        
        String path = request.getURI().getPath();
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui") || path.startsWith("/api-docs")) {
            return body;
        }

        if (status >= 400 || body instanceof ApiResponse || body instanceof String || body instanceof Resource) {
            return body;
        } else {
            // case success
            res.setCode(status); // Trả về mã HTTP thực tế (200, 201,...)
            res.setResult(body);
            ApiMessage apiMessage = returnType.getMethodAnnotation(ApiMessage.class);
            res.setMessage(apiMessage != null ? apiMessage.value() : "Thực hiện thành công");
        }

        return res;
    }
}
