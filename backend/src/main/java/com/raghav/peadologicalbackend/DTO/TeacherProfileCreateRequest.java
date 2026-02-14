package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class TeacherProfileCreateRequest {
    private Long userId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
