package com.ym_project.review.Proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

// "app" → User Service'in spring.application.name değeri
@FeignClient(name = "app")
public interface UserServiceProxy {

    @PatchMapping("/api/users/{id}/trust-score")
    void updateTrustScore(@PathVariable("id") Long userId, @RequestParam("score") Integer score);
}
