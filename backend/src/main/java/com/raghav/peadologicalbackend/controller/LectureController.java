package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.dto.LectureCreateRequest;
import com.raghav.peadologicalbackend.dto.LectureResponse;
import com.raghav.peadologicalbackend.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lectures")
@CrossOrigin(origins = "http://localhost:3000")
public class LectureController {
    private final LectureService lectureService;
    private final com.raghav.peadologicalbackend.repository.UserRepository userRepository;
    private final com.raghav.peadologicalbackend.repository.TeacherProfileRepository teacherProfileRepository;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LectureResponse> create(@RequestBody LectureCreateRequest request) {
        return new ResponseEntity<>(lectureService.createLecture(request), HttpStatus.CREATED);
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LectureResponse> createWithFile(
            @RequestParam("teacherProfileId") Long teacherProfileId,
            @RequestParam(value = "classSlotId", required = false) Long classSlotId,
            @RequestParam("lectureTitle") String lectureTitle,
            @RequestParam(value = "audio", required = false) org.springframework.web.multipart.MultipartFile audio) {
        
        LectureCreateRequest request = new LectureCreateRequest();
        request.setTeacherProfileId(teacherProfileId);
        request.setClassSlotId(classSlotId);
        request.setLectureTitle(lectureTitle);
        
        return new ResponseEntity<>(lectureService.createLecture(request, audio), HttpStatus.CREATED);
    }
    
    @GetMapping("/my-recent")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<LectureResponse>> getMyRecentLectures() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.raghav.peadologicalbackend.entity.Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        com.raghav.peadologicalbackend.entity.TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found"));

        return ResponseEntity.ok(lectureService.getRecentLectures(profile.getId())); 
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<LectureResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(lectureService.getLectureById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<LectureResponse>> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(lectureService.getLecturesByTeacher(teacherId));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<List<LectureResponse>> getByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(lectureService.getLecturesByClass(classId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN','SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lectureService.deleteLecture(id);
        return ResponseEntity.noContent().build();
    }
}
