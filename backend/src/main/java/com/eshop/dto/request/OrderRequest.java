package com.eshop.dto.request;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.*;

@Data
public class OrderRequest {

    @NotBlank
    private String paymentMethod;

    @Valid
    @NotNull
    private AddressRequest shippingAddress;

    private String notes;
}
