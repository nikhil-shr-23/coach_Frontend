package com.raghav.peadologicalbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WhisperResponse {
    @JsonProperty("request_id")
    private String requestId;
    
    private AnalysisData data;

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public AnalysisData getData() { return data; }
    public void setData(AnalysisData data) { this.data = data; }

    @Data
    public static class AnalysisData {
        private String analysis;
        
        @JsonProperty("pedagogical_score")
        private Double pedagogicalScore;
        
        @JsonProperty("score_reasoning")
        private String scoreReasoning;
        
        @JsonProperty("processing_time_seconds")
        private Double processingTimeSeconds;

        @JsonProperty("review_ratio")
        private Double reviewRatio;

        @JsonProperty("question_velocity")
        private Double questionVelocity;

        @JsonProperty("wait_time")
        private Double waitTime;

        @JsonProperty("teacher_talking_time")
        private Double teacherTalkingTime;

        @JsonProperty("hinglish_fluency")
        private Double hinglishFluency;

        public String getAnalysis() { return analysis; }
        public void setAnalysis(String analysis) { this.analysis = analysis; }
        public Double getPedagogicalScore() { return pedagogicalScore; }
        public void setPedagogicalScore(Double pedagogicalScore) { this.pedagogicalScore = pedagogicalScore; }
        public String getScoreReasoning() { return scoreReasoning; }
        public void setScoreReasoning(String scoreReasoning) { this.scoreReasoning = scoreReasoning; }
        public Double getProcessingTimeSeconds() { return processingTimeSeconds; }
        public void setProcessingTimeSeconds(Double processingTimeSeconds) { this.processingTimeSeconds = processingTimeSeconds; }
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
}
