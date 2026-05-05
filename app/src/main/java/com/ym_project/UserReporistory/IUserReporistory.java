package com.ym_project.UserReporistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ym_project.Entity.UserCredentials;
import com.ym_project.Entity.UserProfile;

@Repository
public interface IUserReporistory extends JpaRepository<UserProfile,Long> {


    @Query(value = "SELECT * FROM user_credentials WHERE email=?1 ",nativeQuery = true)
    public UserCredentials findUserByEmail(String email);

    
}
