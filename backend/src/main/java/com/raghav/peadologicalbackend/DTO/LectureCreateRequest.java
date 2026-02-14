package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class LectureCreateRequest {
    private Long teacherProfileId;
    private Long classSlotId;
    private String lectureTitle;
    private String lectureAudioUrl;

    public Long getTeacherProfileId() { return teacherProfileId; }
    public void setTeacherProfileId(Long teacherProfileId) { this.teacherProfileId = teacherProfileId; }
    public Long getClassSlotId() { return classSlotId; }
    public void setClassSlotId(Long classSlotId) { this.classSlotId = classSlotId; }
    public String getLectureTitle() { return lectureTitle; }
    public void setLectureTitle(String lectureTitle) { this.lectureTitle = lectureTitle; }
    public String getLectureAudioUrl() { return lectureAudioUrl; }
    public void setLectureAudioUrl(String lectureAudioUrl) { this.lectureAudioUrl = lectureAudioUrl; }
}
