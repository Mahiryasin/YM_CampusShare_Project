package com.ym_project.catalog.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ItemResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private Double dailyPrice;
    private String condition;
    private Boolean isAvailable;
    private Long ownerUserId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
