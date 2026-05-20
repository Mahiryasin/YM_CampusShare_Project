package com.ym_project.UserReporistory;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ym_project.Entity.PasswordResetToken;

public interface IPasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByEmail(String email);
    void deleteByEmail(String email);
}
