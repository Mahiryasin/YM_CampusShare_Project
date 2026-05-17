package com.ym_project.review.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDTO {
    private Long id;
    private Long rentalId;
    private Long reviewerUserId;
    private Long targetUserId;
    private Long itemId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdDate;
}
