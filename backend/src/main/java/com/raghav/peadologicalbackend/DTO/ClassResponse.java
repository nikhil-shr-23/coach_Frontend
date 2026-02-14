package com.raghav.peadologicalbackend.dto;

import com.raghav.peadologicalbackend.entity.DayOfWeek;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ClassResponse {
    private Long id;
    private Long timetableId;
    private String roomNumber;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String courseName;
    private String subjectName;
}
