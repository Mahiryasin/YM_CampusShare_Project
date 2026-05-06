package com.ym_project.ApiGatewayLocator;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiGatewaylocator {

    @Bean

    public RouteLocator routes(RouteLocatorBuilder routeLocatorBuilder){
   return routeLocatorBuilder.routes().route((route)->route.path("/api/catalog/**").uri("lb://catalog-service")).route((route)->route.path("/api/users/**").uri("lb://app"))
    .route((route)->route.path("/api/rentals/**").uri("lb://rental-service")).build();
 }

}
