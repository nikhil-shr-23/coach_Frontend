package com.raghav.peadologicalbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SchoolStatsDTO {
    private String schoolName;
    private Long facultyCount;
    private Long lecturesAnalyzed;
    private Double avgScore;
}
