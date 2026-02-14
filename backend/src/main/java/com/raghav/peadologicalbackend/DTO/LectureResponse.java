package com.raghav.peadologicalbackend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LectureResponse {
    private Long id;
    private String lectureTitle;
    private String lectureAudioUrl;
    private Double score;
    private LocalDateTime uploadedAt;
    private Long teacherProfileId;
    private Long classSlotId;
}
