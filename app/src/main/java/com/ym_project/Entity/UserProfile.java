package com.ym_project.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user_profile")
@Data
public class UserProfile extends BaseEntity {

    @Column(name = "student_number", unique = true)
    private String studentNumber;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "trust_score")
    private Integer trustScore;

    

    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private UserCredentials userCredentials;

}
