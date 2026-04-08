package com.eshop.service;

import com.eshop.dto.request.ReviewRequest;
import com.eshop.dto.response.PagedResponse;
import com.eshop.dto.response.ReviewResponse;
import com.eshop.exception.BadRequestException;
import com.eshop.exception.DuplicateResourceException;
import com.eshop.exception.ResourceNotFoundException;
import com.eshop.model.Product;
import com.eshop.model.Review;
import com.eshop.model.User;
import com.eshop.repository.ProductRepository;
import com.eshop.repository.ReviewRepository;
import com.eshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        Page<Review> reviews = reviewRepository.findByProductIdAndApprovedTrue(
                productId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return PagedResponse.<ReviewResponse>builder()
                .content(reviews.getContent().stream().map(this::mapToResponse).toList())
                .page(reviews.getNumber())
                .size(reviews.getSize())
                .totalElements(reviews.getTotalElements())
                .totalPages(reviews.getTotalPages())
                .last(reviews.isLast())
                .build();
    }

    @Transactional
    public ReviewResponse createReview(Long productId, Long userId, ReviewRequest request) {
        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new DuplicateResourceException("You have already reviewed this product");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
        updateProductRating(product);
        return mapToResponse(review);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        updateProductRating(product);
    }

    private void updateProductRating(Product product) {
        Page<Review> reviews = reviewRepository.findByProductIdAndApprovedTrue(
                product.getId(), PageRequest.of(0, Integer.MAX_VALUE));
        if (reviews.isEmpty()) {
            product.setAverageRating(BigDecimal.ZERO);
            product.setReviewCount(0);
        } else {
            double avg = reviews.getContent().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0);
            product.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            product.setReviewCount((int) reviews.getTotalElements());
        }
        productRepository.save(product);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userFirstName(review.getUser().getFirstName())
                .userLastName(review.getUser().getLastName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
