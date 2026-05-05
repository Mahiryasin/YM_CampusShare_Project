package com.ym_project.rental.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ym_project.rental.Entity.RentalStatus;

import lombok.Data;

@Data
public class RentalResponseDTO {

    private Long id;
    private Long itemId;
    private Long renterUserId;
    private Long ownerUserId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
    private RentalStatus status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
