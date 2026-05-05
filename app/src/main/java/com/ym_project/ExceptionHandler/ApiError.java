package com.ym_project.ExceptionHandler;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.Data;

@Data
public class ApiError<T> {
    
   private HttpStatus status;
   private String Hostname;
   private T data;
   private String path;
   private String Description;

   private LocalDateTime date;


}
