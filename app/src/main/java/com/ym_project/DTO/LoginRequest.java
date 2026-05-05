package com.ym_project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "bos veya null olamaz !")
    @Email(message = "email formatında olmalı !")

    private String email;

    @NotBlank(message = "bos veya null olamaz !")
    private String password;

}
