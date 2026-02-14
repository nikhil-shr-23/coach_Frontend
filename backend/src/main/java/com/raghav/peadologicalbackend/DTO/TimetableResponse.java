package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class TimetableResponse {
    private Long id;
    private Long teacherProfileId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTeacherProfileId() { return teacherProfileId; }
    public void setTeacherProfileId(Long teacherProfileId) { this.teacherProfileId = teacherProfileId; }
}
