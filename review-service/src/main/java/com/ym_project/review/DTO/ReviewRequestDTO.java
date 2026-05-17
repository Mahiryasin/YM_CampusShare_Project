package com.ym_project.review.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDTO {

    @NotNull(message = "Rental ID boş bırakılamaz")
    private Long rentalId;

    @NotNull(message = "Reviewer User ID boş bırakılamaz")
    private Long reviewerUserId;

    @NotNull(message = "Target User ID boş bırakılamaz")
    private Long targetUserId;

    @NotNull(message = "Item ID boş bırakılamaz")
    private Long itemId;

    @NotNull(message = "Puan (Rating) boş bırakılamaz")
    @Min(value = 1, message = "Puan en az 1 olmalıdır")
    @Max(value = 5, message = "Puan en fazla 5 olmalıdır")
    private Integer rating;

    private String comment;
}
