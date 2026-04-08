package com.eshop.dto.request;

import lombok.Data;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    private String description;

    @NotBlank
    @Size(max = 50)
    private String sku;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @DecimalMin("0.01")
    private BigDecimal salePrice;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotNull
    private Long categoryId;

    @Size(max = 100)
    private String brand;

    @Size(max = 50)
    private String scale;

    private String specifications;

    private List<String> imageUrls;

    private String primaryImageUrl;

    private boolean featured;

    private boolean active = true;
}
