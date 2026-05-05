package com.ym_project.rental.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "rentals")
@Data
@EqualsAndHashCode(callSuper = true)
public class Rental extends BaseEntity {

    @Column(nullable = false)
    private Long itemId;         // Catalog Service'deki item ID

    @Column(nullable = false)
    private Long renterUserId;   // Kiralayan kullanıcı ID

    @Column(nullable = false)
    private Long ownerUserId;    // İlan sahibi kullanıcı ID

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.PENDING;
}
