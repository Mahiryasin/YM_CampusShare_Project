package com.ym_project.SecurityService;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.management.relation.Role;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.ym_project.Entity.UserCredentials;
import com.ym_project.Entity.UserProfile;

import lombok.Data;

@Data
@Component
public class MyUserDetails implements UserDetails {

    private String email;
  
    private boolean isActive;

    private String password;
    private List<GrantedAuthority> roles;
    private Long userProfile_id;
    private LocalDateTime lastLoginDate;
    
    public UserDetails createUser(UserCredentials userCredentials){

       MyUserDetails myUserDetails=new MyUserDetails();
       myUserDetails.email=userCredentials.getEmail();
       myUserDetails.password=userCredentials.getPassword();
       myUserDetails.userProfile_id=userCredentials.getUserProfile().getId();
       myUserDetails.lastLoginDate=LocalDateTime.now();
       myUserDetails.isActive=userCredentials.isActive();
       myUserDetails.roles=new ArrayList<>(List.of(new SimpleGrantedAuthority(com.ym_project.Entity.Role.USER.toString())));
       return  myUserDetails;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getUsername() {
        return email;
    }



}
