package com.ym_project.review.Controller;

import com.ym_project.review.DTO.ReviewRequestDTO;
import com.ym_project.review.DTO.ReviewResponseDTO;
import com.ym_project.review.Service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(@Valid @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO response = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/reviews/user/{userId} - Get reviews left for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForUser(@PathVariable Long userId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByTargetUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // GET /api/reviews/reviewer/{reviewerId} - Get reviews written by a user
    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByReviewer(@PathVariable Long reviewerId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByReviewerUser(reviewerId);
        return ResponseEntity.ok(reviews);
    }

    // GET /api/reviews/item/{itemId} - Get reviews for a specific item
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForItem(@PathVariable Long itemId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByItem(itemId);
        return ResponseEntity.ok(reviews);
    }

    // GET /api/reviews/user/{userId}/average - Get average rating (trust score) for a user
    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long userId) {
        Double average = reviewService.getAverageRatingForUser(userId);
        return ResponseEntity.ok(average);
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
