package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.dto.TeacherProfileCreateRequest;
import com.raghav.peadologicalbackend.dto.TeacherProfileResponse;
import com.raghav.peadologicalbackend.service.TeacherProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teacher-profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherProfileController {
    private final TeacherProfileService teacherProfileService;

    @PostMapping
    public ResponseEntity<TeacherProfileResponse> create(@RequestBody TeacherProfileCreateRequest request) {
        return new ResponseEntity<>(teacherProfileService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherProfileResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(teacherProfileService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<TeacherProfileResponse>> list() {
        return ResponseEntity.ok(teacherProfileService.list());
    }

    @GetMapping("/me")
    public ResponseEntity<TeacherProfileResponse> getMe() {
        return ResponseEntity.ok(teacherProfileService.getProfileForCurrentUser());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teacherProfileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
