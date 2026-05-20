package com.ym_project.SecurityConfig;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ym_project.SecurityService.UserDetailService;
import com.ym_project.SecurityService.jwtAuthenticationfilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailService userDetailService;
    private final jwtAuthenticationfilter jwtAuthenticationfilter;

    private final AuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(UserDetailService userDetailService,jwtAuthenticationfilter jwtAuthenticationfilter,AuthenticationEntryPoint authenticationEntryPoint){
        this.userDetailService=userDetailService;
        this.jwtAuthenticationfilter=jwtAuthenticationfilter;
        this.authenticationEntryPoint=authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfiguration()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/admin/**").hasAnyAuthority("ADMIN")
                        .requestMatchers("/api/users/register", "/api/users/login", "/api/users/count", "/api/users/forgot-password", "/api/users/reset-password").permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationManager(authenticationManager(httpSecurity))
                .exceptionHandling((ex)->ex.authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationfilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return urlBasedCorsConfigurationSource;
    }
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity httpSecurity) throws Exception {
       AuthenticationManagerBuilder authenticationManagerBuilder=httpSecurity.getSharedObject(AuthenticationManagerBuilder.class);
       authenticationManagerBuilder
       .userDetailsService(userDetailService)
       .passwordEncoder(passwordEncoder());

       return authenticationManagerBuilder.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    

}
