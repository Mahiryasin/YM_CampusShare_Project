package com.ym_project.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "refresh_token")
@Data
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
    @NotBlank
    @Column(name = "token",nullable = false)
    private String token;

    @Column(name = "expire_date",nullable = false)
    @Future
    private LocalDate ExpireDate;

    @Column(name = "create_date",nullable = false)
    private LocalDateTime CreateDate=LocalDateTime.now();

    @Column(name = "issued",nullable = false)
    private boolean issued=true;

    @NotBlank
    @Column(name = "email", nullable = false)
    private String email;

}
