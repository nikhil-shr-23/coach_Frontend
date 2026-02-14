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
public class LectureController {
    private final LectureService lectureService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LectureResponse> create(@RequestBody LectureCreateRequest request) {
        return new ResponseEntity<>(lectureService.createLecture(request), HttpStatus.CREATED);
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
