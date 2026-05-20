package com.ym_project.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "password_reset_tokens")
@Data
@EqualsAndHashCode(callSuper = true)
public class PasswordResetToken extends BaseEntity {

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
