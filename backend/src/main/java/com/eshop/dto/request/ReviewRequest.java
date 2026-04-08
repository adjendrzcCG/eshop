package com.eshop.dto.request;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class ReviewRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 100)
    private String title;

    @Size(max = 2000)
    private String comment;
}
