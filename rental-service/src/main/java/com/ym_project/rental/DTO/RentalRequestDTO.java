package com.ym_project.rental.DTO;

import java.time.LocalDate;

import com.ym_project.rental.Entity.RentalStatus;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RentalRequestDTO {

    @NotNull(message = "Item ID boş olamaz")
    private Long itemId;

    @NotNull(message = "Kiralayan kullanıcı ID boş olamaz")
    private Long renterUserId;

    @NotNull(message = "Sahip kullanıcı ID boş olamaz")
    private Long ownerUserId;

    @NotNull(message = "Başlangıç tarihi boş olamaz")
    @FutureOrPresent(message = "Başlangıç tarihi geçmişte olamaz")
    private LocalDate startDate;

    @NotNull(message = "Bitiş tarihi boş olamaz")
    private LocalDate endDate;

    @NotNull(message = "Toplam fiyat boş olamaz")
    @Positive(message = "Toplam fiyat pozitif olmalıdır")
    private Double totalPrice;

    private RentalStatus status;
}
