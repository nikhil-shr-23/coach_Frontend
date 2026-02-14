package com.raghav.peadologicalbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FacultyStatsDTO {
    private Long id;
    private String name;
    private String department;
    private Long lecturesAnalyzed;
    private Double avgScore;
    private LocalDateTime lastActive;
}
