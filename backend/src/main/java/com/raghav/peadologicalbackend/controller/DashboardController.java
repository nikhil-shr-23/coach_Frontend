package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.dto.FacultyStatsDTO;
import com.raghav.peadologicalbackend.dto.SchoolStatsDTO;
import com.raghav.peadologicalbackend.entity.TeacherProfile;
import com.raghav.peadologicalbackend.repository.LectureRepository;
import com.raghav.peadologicalbackend.repository.TeacherProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final TeacherProfileRepository teacherRepo;
    private final LectureRepository lectureRepo;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SchoolStatsDTO>> getDashboardStats() {
        // 1. Get Faculty Counts per School
        List<Object[]> facultyCounts = teacherRepo.countFacultyBySchool();
        Map<String, Long> facultyCountMap = new HashMap<>();
        for (Object[] row : facultyCounts) {
            facultyCountMap.put((String) row[0], (Long) row[1]);
        }

        // 2. Get Lecture Stats per School
        List<Object[]> lectureStats = lectureRepo.findLectureStatsBySchool();
        Map<String, Object[]> lectureStatsMap = new HashMap<>();
        for (Object[] row : lectureStats) {
            lectureStatsMap.put((String) row[0], row);
        }

        // 3. Merge
        List<SchoolStatsDTO> stats = new ArrayList<>();
        // Iterate over all schools found in faculty counts (primary source of schools)
        for (String school : facultyCountMap.keySet()) {
            if (school == null) continue; // Skip null schools if any

            Long facultyCount = facultyCountMap.get(school);
            Long lecturesAnalyzed = 0L;
            Double avgScore = 0.0;

            if (lectureStatsMap.containsKey(school)) {
                Object[] lStats = lectureStatsMap.get(school);
                lecturesAnalyzed = (Long) lStats[1];
                avgScore = (Double) lStats[2];
            }

            stats.add(new SchoolStatsDTO(school, facultyCount, lecturesAnalyzed, avgScore != null ? avgScore : 0.0));
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/school/{schoolName}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')") // Admin here means Dean
    public ResponseEntity<List<FacultyStatsDTO>> getSchoolFaculty(@PathVariable String schoolName) {
        // 1. Get all teachers for the school
        List<TeacherProfile> teachers = teacherRepo.findBySchool(schoolName);

        // 2. Get aggregated stats for teachers in this school
        List<Object[]> teacherStats = lectureRepo.findTeacherStatsBySchool(schoolName);
        Map<Long, Object[]> statsMap = new HashMap<>();
        for (Object[] row : teacherStats) {
            statsMap.put((Long) row[0], row);
        }

        // 3. Merge
        List<FacultyStatsDTO> result = teachers.stream().map(teacher -> {
            Long lectures = 0L;
            Double score = 0.0;
            LocalDateTime lastActive = null;

            if (statsMap.containsKey(teacher.getId())) {
                Object[] row = statsMap.get(teacher.getId());
                lectures = (Long) row[1];
                score = (Double) row[2];
                lastActive = (LocalDateTime) row[3];
            }

            return new FacultyStatsDTO(
                    teacher.getId(),
                    teacher.getUser().getName(),
                    teacher.getDepartment(),
                    lectures,
                    score != null ? score : 0.0,
                    lastActive
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
