package com.ym_project.catalog.DTO;

import lombok.Data;

// User Service'den dönen kullanıcı bilgileri
// User Service'deki UserProfileResponse ile aynı alanları içermeli
@Data
public class UserProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String studentNumber;
    private Integer trustScore;

}
