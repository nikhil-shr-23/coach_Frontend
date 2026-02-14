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
    private String analysisContent;
    private String scoreReasoning;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLectureTitle() { return lectureTitle; }
    public void setLectureTitle(String lectureTitle) { this.lectureTitle = lectureTitle; }
    public String getLectureAudioUrl() { return lectureAudioUrl; }
    public void setLectureAudioUrl(String lectureAudioUrl) { this.lectureAudioUrl = lectureAudioUrl; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public Long getTeacherProfileId() { return teacherProfileId; }
    public void setTeacherProfileId(Long teacherProfileId) { this.teacherProfileId = teacherProfileId; }
    public Long getClassSlotId() { return classSlotId; }
    public void setClassSlotId(Long classSlotId) { this.classSlotId = classSlotId; }
    public String getAnalysisContent() { return analysisContent; }
    public void setAnalysisContent(String analysisContent) { this.analysisContent = analysisContent; }
    public String getScoreReasoning() { return scoreReasoning; }
    public void setScoreReasoning(String scoreReasoning) { this.scoreReasoning = scoreReasoning; }
}
