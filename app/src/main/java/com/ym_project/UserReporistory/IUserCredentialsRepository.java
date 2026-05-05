package com.ym_project.UserReporistory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ym_project.Entity.UserCredentials;

@Repository
public interface IUserCredentialsRepository extends JpaRepository<UserCredentials, Long> {

    Optional<UserCredentials> findByEmail(String email);

    boolean existsByEmail(String email);

}
