package com.ym_project.Controller;

import org.hibernate.validator.constraints.Length;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ym_project.DTO.LoginRequest;
import com.ym_project.DTO.LoginResponse;
import com.ym_project.DTO.RefreshTokenRequest;
import com.ym_project.DTO.RegisterRequest;
import com.ym_project.DTO.UserProfileResponse;
import com.ym_project.Entity.RefreshToken;
import com.ym_project.Service.RefreshTokenService;
import com.ym_project.Service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final UserService userService;

    private final RefreshTokenService refreshTokenService;

    public UserController(UserService userService,RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.refreshTokenService=refreshTokenService;
    }

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserProfileResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/users/profile/{id}
    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable @Positive(message = "girilen parametre pozitif olmalı !") Long id) {
        UserProfileResponse response = userService.getProfile(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> info(@AuthenticationPrincipal UserDetails userDetails ){
        if(userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı girişi yapılmadı !");
        }
       return ResponseEntity.ok(userDetails);
    } 

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userService.getUserCount());
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) throws Exception{
        return ResponseEntity.ok(refreshTokenService.refreshToken(refreshTokenRequest));

    }
}
