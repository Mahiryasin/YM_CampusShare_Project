package com.ym_project.review.Service;

import com.ym_project.review.DTO.ReviewRequestDTO;
import com.ym_project.review.DTO.ReviewResponseDTO;
import com.ym_project.review.Entity.Review;
import com.ym_project.review.Proxy.UserServiceProxy;
import com.ym_project.review.Repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserServiceProxy userServiceProxy;

    @InjectMocks
    private ReviewService reviewService;

    private Review sampleReview;

    @BeforeEach
    void setUp() {
        sampleReview = new Review(1L, 1L, 2L, 3L, 5L, 5, "Harika deneyim!", LocalDateTime.now());
    }

    @Test
    void createReview_ShouldSaveAndReturnResponse() {
        ReviewRequestDTO request = ReviewRequestDTO.builder()
                .rentalId(1L).reviewerUserId(2L).targetUserId(3L)
                .itemId(5L).rating(5).comment("Harika deneyim!").build();

        when(reviewRepository.save(any(Review.class))).thenReturn(sampleReview);
        when(reviewRepository.findByTargetUserId(anyLong())).thenReturn(List.of(sampleReview));
        doNothing().when(userServiceProxy).updateTrustScore(any(), any());

        ReviewResponseDTO result = reviewService.createReview(request);

        assertThat(result).isNotNull();
        assertThat(result.getRating()).isEqualTo(5);
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void getAverageRatingForUser_WhenNoReviews_ShouldReturnDefault5() {
        when(reviewRepository.findByTargetUserId(99L)).thenReturn(List.of());
        Double avg = reviewService.getAverageRatingForUser(99L);
        assertThat(avg).isEqualTo(5.0);
    }

    @Test
    void getAverageRatingForUser_WhenReviewsExist_ShouldReturnCorrectAverage() {
        Review r1 = new Review(2L, 1L, 2L, 3L, 5L, 4, "İyi", LocalDateTime.now());
        Review r2 = new Review(3L, 1L, 2L, 3L, 5L, 2, "Orta", LocalDateTime.now());
        when(reviewRepository.findByTargetUserId(3L)).thenReturn(List.of(r1, r2));
        Double avg = reviewService.getAverageRatingForUser(3L);
        assertThat(avg).isEqualTo(3.0);
    }

    @Test
    void getReviewsByTargetUser_ShouldReturnMappedList() {
        when(reviewRepository.findByTargetUserId(3L)).thenReturn(List.of(sampleReview));
        List<ReviewResponseDTO> result = reviewService.getReviewsByTargetUser(3L);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTargetUserId()).isEqualTo(3L);
    }
}
