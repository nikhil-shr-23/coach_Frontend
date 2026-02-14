package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.dto.TimetableCreateRequest;
import com.raghav.peadologicalbackend.dto.TimetableResponse;
import com.raghav.peadologicalbackend.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/timetables")
public class TimetableController {
    private final TimetableService timetableService;

    @PostMapping
    public ResponseEntity<TimetableResponse> create(@RequestBody TimetableCreateRequest request) {
        return new ResponseEntity<>(timetableService.create(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimetableResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(timetableService.get(id));
    }

    @GetMapping
    public ResponseEntity<List<TimetableResponse>> list() {
        return ResponseEntity.ok(timetableService.list());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timetableService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
