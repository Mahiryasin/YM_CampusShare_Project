package com.ym_project.catalog.ExceptionHandler;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.Data;

// User Service'deki ApiError ile aynı yapı - FeignException body'sini parse etmek için
@Data
public class ApiError<T> {

    private HttpStatus status;
    private String Hostname;
    private T data;
    private String path;
    private String Description;
    private LocalDateTime date;

}
