package com.ym_project.ExceptionHandler;

public enum ERROR {

    NOT_FOUND("Kaynak bulunamadı", 404),
    EMAIL_ALREADY_EXISTS("Bu email zaten kayıtlı", 409),
    BAD_CREDENTIALS("Email veya şifre hatalı", 401),
    TOKEN_EXPIRED("Refresh Token süresi dolmuş veya geçersiz!", 401),
    INVALID_TOKEN("Geçersiz veya süresi dolmuş doğrulama kodu", 400),
    GENERAL_ERROR("Beklenmeyen bir hata oluştu", 500);

    private final String error_message;
    private final Integer status;

    ERROR(String error_message, Integer status) {
        this.error_message = error_message;
        this.status = status;
    }

    public String getError_message() {
        return error_message;
    }

    public Integer getStatus() {
        return status;
    }

    public ErrorResponse toErrorResponse() {
        return new ErrorResponse(error_message, status);
    }

}
