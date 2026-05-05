package com.ym_project.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String studentNumber;
    private Integer trustScore;

}
