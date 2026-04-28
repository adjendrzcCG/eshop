package com.eshop.dto.request;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class CategoryRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    private String description;

    @NotBlank
    @Size(max = 100)
    private String slug;

    private String imageUrl;

    private Long parentId;

    private boolean active = true;
}
