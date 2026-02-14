package com.raghav.peadologicalbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WhisperResponse {
    @JsonProperty("request_id")
    private String requestId;
    
    private AnalysisData data;

    @Data
    public static class AnalysisData {
        private String analysis;
        
        @JsonProperty("pedagogical_score")
        private Double pedagogicalScore;
        
        @JsonProperty("score_reasoning")
        private String scoreReasoning;
        
        @JsonProperty("processing_time_seconds")
        private Double processingTimeSeconds;
    }
}
