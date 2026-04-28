package com.eshop.dto.request;

import lombok.Data;

import javax.validation.Valid;

@Data
public class UpdateProfileRequest {

    private String firstName;
    private String lastName;
    private String phone;

    @Valid
    private AddressRequest address;
}
