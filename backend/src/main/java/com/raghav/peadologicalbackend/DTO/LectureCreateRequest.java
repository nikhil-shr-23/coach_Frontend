package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class LectureCreateRequest {
    private Long teacherProfileId;
    private Long classSlotId;
    private String lectureTitle;
    private String lectureAudioUrl;

    // Analysis fields (sent from frontend after direct whisper call)
    private Double score;
    private String analysisContent;
    private String scoreReasoning;
    private Double reviewRatio;
    private Double questionVelocity;
    private Double waitTime;
    private Double teacherTalkingTime;
    private Double hinglishFluency;

    public Long getTeacherProfileId() { return teacherProfileId; }
    public void setTeacherProfileId(Long teacherProfileId) { this.teacherProfileId = teacherProfileId; }
    public Long getClassSlotId() { return classSlotId; }
    public void setClassSlotId(Long classSlotId) { this.classSlotId = classSlotId; }
    public String getLectureTitle() { return lectureTitle; }
    public void setLectureTitle(String lectureTitle) { this.lectureTitle = lectureTitle; }
    public String getLectureAudioUrl() { return lectureAudioUrl; }
    public void setLectureAudioUrl(String lectureAudioUrl) { this.lectureAudioUrl = lectureAudioUrl; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getAnalysisContent() { return analysisContent; }
    public void setAnalysisContent(String analysisContent) { this.analysisContent = analysisContent; }
    public String getScoreReasoning() { return scoreReasoning; }
    public void setScoreReasoning(String scoreReasoning) { this.scoreReasoning = scoreReasoning; }
    public Double getReviewRatio() { return reviewRatio; }
    public void setReviewRatio(Double reviewRatio) { this.reviewRatio = reviewRatio; }
    public Double getQuestionVelocity() { return questionVelocity; }
    public void setQuestionVelocity(Double questionVelocity) { this.questionVelocity = questionVelocity; }
    public Double getWaitTime() { return waitTime; }
    public void setWaitTime(Double waitTime) { this.waitTime = waitTime; }
    public Double getTeacherTalkingTime() { return teacherTalkingTime; }
    public void setTeacherTalkingTime(Double teacherTalkingTime) { this.teacherTalkingTime = teacherTalkingTime; }
    public Double getHinglishFluency() { return hinglishFluency; }
    public void setHinglishFluency(Double hinglishFluency) { this.hinglishFluency = hinglishFluency; }
}
