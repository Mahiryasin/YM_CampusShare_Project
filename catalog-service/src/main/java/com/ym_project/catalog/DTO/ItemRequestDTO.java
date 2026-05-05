package com.ym_project.catalog.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ItemRequestDTO {

    @NotBlank(message = "Başlık boş olamaz")
    private String title;

    private String description;

    @NotBlank(message = "Kategori boş olamaz")
    private String category;

    @NotNull(message = "Günlük fiyat boş olamaz")
    @Positive(message = "Günlük fiyat pozitif olmalıdır")
    private Double dailyPrice;

    private String condition; // NEW, GOOD, FAIR

    private Boolean isAvailable = true;

    @NotNull(message = "Sahip kullanıcı ID boş olamaz")
    private Long ownerUserId;
}
