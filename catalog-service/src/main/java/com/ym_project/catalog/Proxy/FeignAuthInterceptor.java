package com.ym_project.catalog.Proxy;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.ServletWebRequest;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;

// Catalog Service'e gelen isteğin JWT token'ını alıp
// Feign ile yapılan User Service çağrısına otomatik ekler (Global - tüm Feign çağrılarına uygulanır)
@Component
public class FeignAuthInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes servletRequestAttributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes(); // controllerdaki istek içeriği

        if (servletRequestAttributes != null) { 
            HttpServletRequest request = servletRequestAttributes.getRequest();
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer")) {
                template.header("Authorization", token);
            }
        }
    }

    
}
