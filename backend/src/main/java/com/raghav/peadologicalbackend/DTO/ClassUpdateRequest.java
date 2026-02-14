package com.raghav.peadologicalbackend.dto;

import com.raghav.peadologicalbackend.entity.DayOfWeek;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ClassUpdateRequest {
    private String roomNumber;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String courseName;
    private String subjectName;
}
