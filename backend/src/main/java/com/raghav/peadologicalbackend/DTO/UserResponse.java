package com.raghav.peadologicalbackend.dto;

import com.raghav.peadologicalbackend.entity.Roles;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Roles role;
    private LocalDateTime createdAt;
}
