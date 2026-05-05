package com.ym_project.ExceptionHandler;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private ArrayList<String> TurnList(ArrayList<String>ErrorList,String message){
        ErrorList.add(message);
        return ErrorList;

    }

    @ExceptionHandler(value ={MethodArgumentNotValidException.class})
    public ResponseEntity<ApiError<Map<String,ArrayList<String>>>>MethodArgumentNotValidExceptionHandler(MethodArgumentNotValidException ex,ServletWebRequest servletWebRequest) throws UnknownHostException{

    Map<String,ArrayList<String>>errorsMap=new HashMap<>();
     String key;
     for(ObjectError error:ex.getBindingResult().getAllErrors()){
     
      if(error instanceof FieldError){
        key=((FieldError)error).getField();

      }
      else{
        key=error.getObjectName();
      }
       String DefaultMessage=error.getDefaultMessage();
       

       if(errorsMap.containsKey(key)){
         errorsMap.put(key,TurnList(errorsMap.get(key),DefaultMessage ));
       } 
       else{
         errorsMap.put(key,TurnList(new ArrayList<>(),DefaultMessage ));

       }
       
    }
    return ResponseEntity.badRequest().body(CreateApiError(errorsMap, servletWebRequest, 400));
    }
    private String Hostname() throws UnknownHostException{
      return InetAddress.getLocalHost().getHostName();
    }

    @ExceptionHandler(value = BaseException.class)
    public ResponseEntity<ApiError<String>> BaseExceptionHandler(BaseException ex,ServletWebRequest servletWebRequest) throws UnknownHostException{
       return ResponseEntity.status(ex.getStatus()).body(CreateApiError(ex.getMessage(), servletWebRequest, ex.getStatus()));
    }
    
    @ExceptionHandler(value = ConstraintViolationException.class)
    public  ResponseEntity<ApiError<Map<String, ArrayList<String>>>> ConstraintViolationExceptionHandler(ConstraintViolationException ex,ServletWebRequest webRequest) throws UnknownHostException{
         Map<String,ArrayList<String>>errorsMap=new HashMap<>();

      for(ConstraintViolation<?> error:ex.getConstraintViolations()){
         String key=error.getPropertyPath().toString();
         String message=error.getMessage();

         
       if(errorsMap.containsKey(key)){
         errorsMap.put(key,TurnList(errorsMap.get(key),message ));
       } 
       else{
         errorsMap.put(key,TurnList(new ArrayList<>(),message ));

       }
       
      }
      return ResponseEntity.badRequest().body(CreateApiError(errorsMap, webRequest, 400));
    }
    

    private <T> ApiError<T> CreateApiError(T data,ServletWebRequest servletWebRequest,Integer status) throws UnknownHostException{
         ApiError<T> apiError =new ApiError<>();
         apiError.setDate(LocalDateTime.now());
         apiError.setPath(servletWebRequest.getRequest().getRequestURI());
         apiError.setHostname(Hostname());
         apiError.setStatus(HttpStatus.valueOf(status));
         apiError.setDescription(servletWebRequest.getDescription(true));
         return apiError;
    }

}
