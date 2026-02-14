package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class TimetableCreateRequest {
    private Long teacherProfileId;

    public Long getTeacherProfileId() { return teacherProfileId; }
    public void setTeacherProfileId(Long teacherProfileId) { this.teacherProfileId = teacherProfileId; }
}
