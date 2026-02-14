package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.dto.ClassCreateRequest;
import com.raghav.peadologicalbackend.dto.ClassResponse;
import com.raghav.peadologicalbackend.dto.ClassUpdateRequest;
import com.raghav.peadologicalbackend.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/classes")
public class ClassController {
    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ClassResponse> create(@RequestBody ClassCreateRequest request) {
        return new ResponseEntity<>(classService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(classService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<ClassResponse>> list(@RequestParam(required = false) Long timetableId) {
        return ResponseEntity.ok(classService.list(timetableId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassResponse> update(@PathVariable Long id, @RequestBody ClassUpdateRequest request) {
        return ResponseEntity.ok(classService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
