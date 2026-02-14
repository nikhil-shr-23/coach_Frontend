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
    private final com.raghav.peadologicalbackend.repository.UserRepository userRepo;

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

    @GetMapping("/teacher/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<FacultyStatsDTO> getMyStats() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.raghav.peadologicalbackend.entity.Users user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TeacherProfile teacher = teacherRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));

        // Get aggregated stats for this teacher
        // findTeacherStatsBySchool returns list of [id, count, avgScore, maxUploadedAt]
        // But we need stats for a single teacher. We can reuse the repo method or better yet, fetch lectures directly.
        // Let's use lectureRepo.findByTeacherProfileId(id) to calculate.
        
        List<com.raghav.peadologicalbackend.entity.Lecture> lectures = lectureRepo.findByTeacherProfileId(teacher.getId());
        
        Long lectureCount = (long) lectures.size();
        Double avgScore = lectures.stream()
                .mapToDouble(l -> l.getScore() != null ? l.getScore() : 0.0)
                .average()
                .orElse(0.0);
        
        // Find last active (uploaded_at)
        LocalDateTime lastActive = lectures.stream()
                .map(com.raghav.peadologicalbackend.entity.Lecture::getUploadedAt)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        FacultyStatsDTO dto = new FacultyStatsDTO(
                teacher.getId(),
                teacher.getUser().getName(),
                teacher.getDepartment(),
                lectureCount,
                avgScore,
                lastActive
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/school/{schoolName}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')") // Admin here means Dean
    public ResponseEntity<List<FacultyStatsDTO>> getSchoolFaculty(@PathVariable String schoolName) {
        // Security Check: If user is ADMIN (Dean), ensure they belong to this school
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!isSuperAdmin) {
            String username = auth.getName();
            com.raghav.peadologicalbackend.entity.Users user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            TeacherProfile profile = teacherRepo.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Dean profile not found"));
            
            if (!profile.getSchool().equalsIgnoreCase(schoolName)) {
                return ResponseEntity.status(403).build();
            }
        }
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
