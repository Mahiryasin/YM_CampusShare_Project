package com.ym_project.RefreshTokenReporistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ym_project.Entity.RefreshToken;

import jakarta.transaction.Transactional;

@Repository
public interface IRefreshTokenReporistory extends JpaRepository<RefreshToken,Long> {
   

    @Transactional
    @Modifying
    @Query(value = "UPDATE refresh_token SET issued=1 WHERE email=?1 ",nativeQuery = true)
    public void SetusedAllTokens(String email);

    @Query(value = "SELECT * FROM refresh_token WHERE token=?1" ,nativeQuery=true )
    public RefreshToken findRefreshTokenFromToken(String refreshToken);

    @Query(value = "DELETE FROM refresh_token WHERE  token=?1",nativeQuery = true)
    public void DeletepastToken(String refreshToken);
}
