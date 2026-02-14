package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class LectureCreateRequest {
    private Long teacherProfileId;
    private Long classSlotId;
    private String lectureTitle;
    private String lectureAudioUrl;
}
