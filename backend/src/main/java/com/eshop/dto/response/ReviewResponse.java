package com.eshop.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private Long productId;
    private Integer rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;
}
