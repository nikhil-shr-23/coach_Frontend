package com.raghav.peadologicalbackend.dto;

import com.raghav.peadologicalbackend.entity.Roles;
import lombok.Data;

@Data
public class UserCreateRequest {
    private String name;
    private String email;
    private String password;
    private Roles role;
}
