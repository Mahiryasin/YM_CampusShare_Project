package com.ym_project.ExceptionHandler;

import lombok.Data;

@Data
public class BaseException extends RuntimeException {
 
    private Integer status;
    public BaseException(String msg,Integer status){
        super(msg);
        this.status=status;
 }
  
    public BaseException(ErrorResponse errorResponse){
        this(errorResponse.CreateErrorResponse(),errorResponse.getStatus());
    }
}
