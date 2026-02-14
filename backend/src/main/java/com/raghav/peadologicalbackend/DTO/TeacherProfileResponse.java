package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class TeacherProfileResponse {
    private Long id;
    private Long userId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
