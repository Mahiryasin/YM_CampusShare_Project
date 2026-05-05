package com.ym_project.ExceptionHandler;

import lombok.Data;

@Data
public class ErrorResponse {

    private String error_message;

    private Integer status;

    public ErrorResponse(String error_message,Integer status){
        this.error_message=error_message;
        this.status=status;
    }
    public String CreateErrorResponse(){
        StringBuilder stringBuilder=new StringBuilder();
        stringBuilder.append(error_message);
        if(status != null){
            stringBuilder.append(" - "+status);
        }
        return stringBuilder.toString();
    }



}
