package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.dto.TimetableCreateRequest;
import com.raghav.peadologicalbackend.dto.TimetableResponse;
import com.raghav.peadologicalbackend.entity.TeacherProfile;
import com.raghav.peadologicalbackend.entity.Timetable;
import com.raghav.peadologicalbackend.exception.BadRequestException;
import com.raghav.peadologicalbackend.exception.NotFoundException;
import com.raghav.peadologicalbackend.repository.TeacherProfileRepository;
import com.raghav.peadologicalbackend.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {
    private final TimetableRepository timetableRepository;
    private final TeacherProfileRepository teacherProfileRepository;

    @org.springframework.transaction.annotation.Transactional
    public TimetableResponse create(TimetableCreateRequest request) {
        TeacherProfile profile = teacherProfileRepository.findById(request.getTeacherProfileId())
                .orElseThrow(() -> new NotFoundException("Teacher profile not found."));
        timetableRepository.findByTeacherProfileId(profile.getId()).ifPresent(existing -> {
            throw new BadRequestException("Timetable already exists for this teacher profile.");
        });
        Timetable timetable = new Timetable();
        timetable.setTeacherProfile(profile);
        return toResponse(timetableRepository.save(timetable));
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public TimetableResponse get(Long id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Timetable not found."));
        return toResponse(timetable);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<TimetableResponse> list() {
        return timetableRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(Long id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Timetable not found."));
        timetableRepository.delete(timetable);
    }

    private TimetableResponse toResponse(Timetable timetable) {
        TimetableResponse response = new TimetableResponse();
        response.setId(timetable.getId());
        response.setTeacherProfileId(timetable.getTeacherProfile().getId());
        return response;
    }
}
