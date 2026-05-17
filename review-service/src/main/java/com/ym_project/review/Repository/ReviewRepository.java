package com.ym_project.review.Repository;

import com.ym_project.review.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetUserId(Long targetUserId);
    List<Review> findByReviewerUserId(Long reviewerUserId);
    List<Review> findByItemId(Long itemId);
    List<Review> findByRentalId(Long rentalId);
}
