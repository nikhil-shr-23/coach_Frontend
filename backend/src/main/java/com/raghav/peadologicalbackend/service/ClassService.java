package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.dto.ClassCreateRequest;
import com.raghav.peadologicalbackend.dto.ClassResponse;
import com.raghav.peadologicalbackend.dto.ClassUpdateRequest;
import com.raghav.peadologicalbackend.entity.ClassEntity;
import com.raghav.peadologicalbackend.entity.Timetable;
import com.raghav.peadologicalbackend.exception.NotFoundException;
import com.raghav.peadologicalbackend.repository.ClassRepository;
import com.raghav.peadologicalbackend.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {
    private final ClassRepository classRepository;
    private final TimetableRepository timetableRepository;

    @Transactional
    public ClassResponse create(ClassCreateRequest request) {
        Timetable timetable = timetableRepository.findById(request.getTimetableId())
                .orElseThrow(() -> new NotFoundException("Timetable not found."));

        ClassEntity classEntity = new ClassEntity();
        classEntity.setTimetable(timetable);
        classEntity.setRoomNumber(request.getRoomNumber());
        classEntity.setDayOfWeek(request.getDayOfWeek());
        classEntity.setStartTime(request.getStartTime());
        classEntity.setEndTime(request.getEndTime());
        classEntity.setCourseName(request.getCourseName());
        classEntity.setSubjectName(request.getSubjectName());

        return toResponse(classRepository.save(classEntity));
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ClassResponse get(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Class slot not found."));
        return toResponse(classEntity);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ClassResponse> list(Long timetableId) {
        if (timetableId != null) {
            return classRepository.findByTimetableId(timetableId).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return classRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ClassResponse update(Long id, ClassUpdateRequest request) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Class slot not found."));

        if (request.getRoomNumber() != null) {
            classEntity.setRoomNumber(request.getRoomNumber());
        }
        if (request.getDayOfWeek() != null) {
            classEntity.setDayOfWeek(request.getDayOfWeek());
        }
        if (request.getStartTime() != null) {
            classEntity.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            classEntity.setEndTime(request.getEndTime());
        }
        if (request.getCourseName() != null) {
            classEntity.setCourseName(request.getCourseName());
        }
        if (request.getSubjectName() != null) {
            classEntity.setSubjectName(request.getSubjectName());
        }

        return toResponse(classRepository.save(classEntity));
    }

    public void delete(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Class slot not found."));
        classRepository.delete(classEntity);
    }

    private ClassResponse toResponse(ClassEntity classEntity) {
        ClassResponse response = new ClassResponse();
        response.setId(classEntity.getId());
        response.setTimetableId(classEntity.getTimetable().getId());
        response.setRoomNumber(classEntity.getRoomNumber());
        response.setDayOfWeek(classEntity.getDayOfWeek());
        response.setStartTime(classEntity.getStartTime());
        response.setEndTime(classEntity.getEndTime());
        response.setCourseName(classEntity.getCourseName());
        response.setSubjectName(classEntity.getSubjectName());
        return response;
    }
}
