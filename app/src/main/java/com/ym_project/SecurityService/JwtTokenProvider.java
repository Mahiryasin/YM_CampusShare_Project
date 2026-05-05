package com.ym_project.SecurityService;

import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;



@Component
public class JwtTokenProvider {

    @org.springframework.beans.factory.annotation.Value("${jwt.secret}")
    private String APIKEY;

    @Value("${jwt.expire}")
    private Long expiration;

    public String GenerateToken(Authentication authentication){
       UserDetails userDetails=(UserDetails) authentication.getPrincipal();
       return  Jwts.builder()
       .subject(userDetails.getUsername())
       .expiration(new Date(System.currentTimeMillis()+ expiration))
       .claim("role",userDetails.getAuthorities())
       .issuedAt(new Date())
       .signWith(Keys())
       .compact();

    }

    
    private SecretKey Keys(){
       byte [] sign= Base64.getDecoder().decode(APIKEY);
       return Keys.hmacShaKeyFor(sign);
    }

    public Claims getClaims(String token){
     return  Jwts.parser()
        .verifyWith(Keys())
        .build()
        .parseSignedClaims(token)
        .getPayload();
 }


  public <T> T GetParseClaims(Function<Claims,T>GetPayload,String token){
    Claims claims=getClaims(token);
    return GetPayload.apply(claims);
  }
  public String GetEmails(String token){
   return GetParseClaims(Claims::getSubject, token);
  }
  public Boolean isExpiration(String token){
  Date expireDate=GetParseClaims(Claims::getExpiration, token);
  return new Date().after(expireDate);
  };
  public GrantedAuthority GetRoles(String token){
     Claims payload=getClaims(token);
     return (GrantedAuthority) payload.get("role");
  }




}
