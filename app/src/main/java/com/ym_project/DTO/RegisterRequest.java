package com.ym_project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email boş olamaz!")
    @Email(message = "Email formatında olmalı!")
    private String email;

    @NotBlank(message = "Şifre boş olamaz!")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalı!")
    private String password;

    @NotBlank(message = "Öğrenci numarası boş olamaz!")
    private String studentNumber;

    @NotBlank(message = "Ad boş olamaz!")
    private String firstName;

    @NotBlank(message = "Soyad boş olamaz!")
    private String lastName;

}
