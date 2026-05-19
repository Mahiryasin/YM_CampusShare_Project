package com.ym_project.review.Service;

import com.ym_project.review.DTO.ReviewRequestDTO;
import com.ym_project.review.DTO.ReviewResponseDTO;
import com.ym_project.review.Entity.Review;
import com.ym_project.review.Proxy.UserServiceProxy;
import com.ym_project.review.Repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserServiceProxy userServiceProxy;

    public ReviewService(ReviewRepository reviewRepository, UserServiceProxy userServiceProxy) {
        this.reviewRepository = reviewRepository;
        this.userServiceProxy = userServiceProxy;
    }

    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO request) {
        Review review = Review.builder()
                .rentalId(request.getRentalId())
                .reviewerUserId(request.getReviewerUserId())
                .targetUserId(request.getTargetUserId())
                .itemId(request.getItemId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Trust Score otomatik güncelle: hedef kullanıcının tüm yorumlarının ortalamasını hesapla
        try {
            double avg = getAverageRatingForUser(request.getTargetUserId());
            int trustScore = (int) Math.round(avg * 20); // 1-5 yıldız → 20-100 arası skor
            userServiceProxy.updateTrustScore(request.getTargetUserId(), trustScore);
        } catch (Exception e) {
            // User Service erişilemezse yorum yine de kaydedilsin, sadece log yaz
            System.err.println("Trust score güncellenemedi: " + e.getMessage());
        }

        return convertToResponse(savedReview);
    }

    public List<ReviewResponseDTO> getReviewsByTargetUser(Long targetUserId) {
        return reviewRepository.findByTargetUserId(targetUserId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getReviewsByReviewerUser(Long reviewerUserId) {
        return reviewRepository.findByReviewerUserId(reviewerUserId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getReviewsByItem(Long itemId) {
        return reviewRepository.findByItemId(itemId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingForUser(Long userId) {
        List<Review> reviews = reviewRepository.findByTargetUserId(userId);
        if (reviews.isEmpty()) {
            return 5.0; // Default reputation/trust score base
        }
        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(5.0);
    }

    @Transactional
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewResponseDTO convertToResponse(Review review) {
        return ReviewResponseDTO.builder()
                .id(review.getId())
                .rentalId(review.getRentalId())
                .reviewerUserId(review.getReviewerUserId())
                .targetUserId(review.getTargetUserId())
                .itemId(review.getItemId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdDate(review.getCreatedDate())
                .build();
    }
}
