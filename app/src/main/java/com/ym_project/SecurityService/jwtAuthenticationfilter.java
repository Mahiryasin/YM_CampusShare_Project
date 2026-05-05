package com.ym_project.SecurityService;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class jwtAuthenticationfilter extends OncePerRequestFilter {

    private final  JwtTokenProvider jwtTokenProvider;

    private final UserDetailService userDetailService;

    public jwtAuthenticationfilter(JwtTokenProvider jwtTokenProvider,UserDetailService userDetailService){
        this.jwtTokenProvider=jwtTokenProvider;
        this.userDetailService=userDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token=ExtractJwtfromRequest(request);
        try{
            
        if(org.springframework.util.StringUtils.hasText(token) && SecurityContextHolder.getContext().getAuthentication() == null){
          String Email=jwtTokenProvider.GetEmails(token);

         UserDetails userDetails=userDetailService.loadUserByUsername(Email);
          
          if(userDetails != null && !jwtTokenProvider.isExpiration(token)){
             UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
             usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
             SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
       }
        }       
        }
        catch(Exception ex){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid or expired token");
            return;
        }

        filterChain.doFilter(request, response);

    

         
    }

    private String ExtractJwtfromRequest(HttpServletRequest request){
     String Header=request.getHeader("Authorization");

     if(org.springframework.util.StringUtils.hasText(Header) && Header.startsWith("Bearer")){
        return Header.substring("Bearer".length()+1);
     }
     return null;

    }



}
