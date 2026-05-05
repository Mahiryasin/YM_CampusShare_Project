package com.ym_project.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {


    @NotBlank(message = "bos veya null olamaz !")
    private String token;
     
    @NotBlank(message = "bos veya null olamaz !")
    private String RefreshToken;

    @NotBlank(message = "bos veya null olamaz !")
    @Email(message = "email formatında olmalı !")
    private String email;

    @NotNull(message = "userId null olamaz !")
    private Long userId;

}
