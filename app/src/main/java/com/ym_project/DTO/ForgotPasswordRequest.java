package com.ym_project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Email bos olamaz")
    @Email(message = "Gecersiz email formati")
    private String email;
}
