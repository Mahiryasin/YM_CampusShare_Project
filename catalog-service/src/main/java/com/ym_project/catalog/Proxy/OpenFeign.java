package com.ym_project.catalog.Proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ym_project.catalog.DTO.UserProfileResponse;

// "app" → User Service'in spring.application.name değeri
@FeignClient(name = "app")
public interface OpenFeign {

    @GetMapping("/api/users/profile/{id}")
    UserProfileResponse GetuserProfile(@PathVariable(name = "id") Long id);

}
