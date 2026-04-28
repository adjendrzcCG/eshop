package com.eshop.dto.request;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class AddressRequest {

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    private String state;

    @NotBlank
    private String zipCode;

    @NotBlank
    private String country;
}
