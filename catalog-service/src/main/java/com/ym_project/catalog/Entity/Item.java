package com.ym_project.catalog.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "items")
@Data
@EqualsAndHashCode(callSuper = true)
public class Item extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double dailyPrice;

    private String condition; // NEW, GOOD, FAIR

    private Boolean isAvailable = true;

    @Column(nullable = false)
    private Long ownerUserId; // User Service'deki kullanıcı ID'si

}
