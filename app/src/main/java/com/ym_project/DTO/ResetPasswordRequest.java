package com.ym_project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "Email bos olamaz")
    @Email(message = "Gecersiz email formati")
    private String email;

    @NotBlank(message = "Dogrulama kodu bos olamaz")
    private String token;

    @NotBlank(message = "Yeni sifre bos olamaz")
    @Size(min = 6, message = "Sifre en az 6 karakter olmalidir")
    private String newPassword;
}
