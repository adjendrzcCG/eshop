package com.eshop.dto.request;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class CartItemRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
