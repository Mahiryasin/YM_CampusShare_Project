package com.ym_project.Mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ym_project.DTO.RegisterRequest;
import com.ym_project.DTO.UserProfileResponse;
import com.ym_project.Entity.UserProfile;


import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public interface MapperClass {

    // Alan adları aynı olanlar (firstName, lastName, studentNumber) otomatik eşlenir
    // UserProfile'da olmayan alanlar (email, password) MapStruct tarafından görmezden gelinir
    @Mapping(target = "userCredentials", ignore = true)
    UserProfile turnUserProfile(RegisterRequest registerRequest);

    @Mapping(source = "id", target = "id")
    UserProfileResponse userProfileResponse(UserProfile userProfile);

}

