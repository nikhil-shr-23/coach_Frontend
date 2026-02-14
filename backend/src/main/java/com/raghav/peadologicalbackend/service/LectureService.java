package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.dto.LectureCreateRequest;
import com.raghav.peadologicalbackend.dto.LectureResponse;
import com.raghav.peadologicalbackend.entity.ClassEntity;
import com.raghav.peadologicalbackend.entity.Lecture;
import com.raghav.peadologicalbackend.entity.TeacherProfile;
import com.raghav.peadologicalbackend.exception.BadRequestException;
import com.raghav.peadologicalbackend.exception.ForbiddenException;
import com.raghav.peadologicalbackend.exception.NotFoundException;
import com.raghav.peadologicalbackend.repository.ClassRepository;
import com.raghav.peadologicalbackend.repository.LectureRepository;
import com.raghav.peadologicalbackend.repository.TeacherProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LectureService {
    private final LectureRepository lectureRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ClassRepository classRepository;

    @Transactional
    public LectureResponse createLecture(LectureCreateRequest request) {
        if (!hasRole("TEACHER")) {
            throw new ForbiddenException("Only TEACHER can create lectures.");
        }
        validateCreate(request);

        TeacherProfile teacherProfile = teacherProfileRepository.findById(request.getTeacherProfileId())
                .orElseThrow(() -> new NotFoundException("Teacher profile not found."));
        ensureTeacherOwnsProfile(teacherProfile);

        ClassEntity classSlot = null;
        if (request.getClassSlotId() != null) {
            classSlot = classRepository.findById(request.getClassSlotId())
                    .orElseThrow(() -> new NotFoundException("Class slot not found."));
            Long classTeacherId = classSlot.getTimetable().getTeacherProfile().getId();
            if (!classTeacherId.equals(teacherProfile.getId())) {
                throw new BadRequestException("Class slot does not belong to the teacher's timetable.");
            }
        }

        Lecture lecture = new Lecture();
        lecture.setLectureTitle(request.getLectureTitle().trim());
        lecture.setLectureAudioUrl(request.getLectureAudioUrl().trim());
        lecture.setTeacherProfile(teacherProfile);
        lecture.setClassSlot(classSlot);

        return toResponse(lectureRepository.save(lecture));
    }

    @Transactional(readOnly = true)
    public LectureResponse getLectureById(Long id) {
        Lecture lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lecture not found."));
        ensureCanView(lecture);
        return toResponse(lecture);
    }

    @Transactional(readOnly = true)
    public List<LectureResponse> getLecturesByTeacher(Long teacherProfileId) {
        if (hasRole("TEACHER")) {
            TeacherProfile profile = teacherProfileRepository.findById(teacherProfileId)
                    .orElseThrow(() -> new NotFoundException("Teacher profile not found."));
            ensureTeacherOwnsProfile(profile);
        } else if (!hasAnyRole("ADMIN", "SUPER_ADMIN")) {
            throw new ForbiddenException("Not allowed to view lectures.");
        }

        return lectureRepository.findByTeacherProfileId(teacherProfileId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LectureResponse> getLecturesByClass(Long classId) {
        ClassEntity classSlot = classRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Class slot not found."));

        if (hasRole("TEACHER")) {
            ensureTeacherOwnsProfile(classSlot.getTimetable().getTeacherProfile());
        } else if (!hasAnyRole("ADMIN", "SUPER_ADMIN")) {
            throw new ForbiddenException("Not allowed to view lectures.");
        }

        return lectureRepository.findByClassSlotId(classId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteLecture(Long id) {
        Lecture lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lecture not found."));

        if (hasRole("TEACHER")) {
            ensureTeacherOwnsProfile(lecture.getTeacherProfile());
        } else if (!hasAnyRole("ADMIN", "SUPER_ADMIN")) {
            throw new ForbiddenException("Not allowed to delete lectures.");
        }

        lectureRepository.delete(lecture);
    }

    private void validateCreate(LectureCreateRequest request) {
        if (request.getTeacherProfileId() == null) {
            throw new BadRequestException("Teacher profile id is required.");
        }
        if (request.getLectureTitle() == null || request.getLectureTitle().trim().isEmpty()) {
            throw new BadRequestException("Lecture title is required.");
        }
        if (request.getLectureAudioUrl() == null || request.getLectureAudioUrl().trim().isEmpty()) {
            throw new BadRequestException("Lecture audio URL is required.");
        }
    }

    private void ensureTeacherOwnsProfile(TeacherProfile profile) {
        String username = getCurrentUsername();
        if (username == null || !username.equals(profile.getUser().getUsername())) {
            throw new ForbiddenException("You can only manage your own lectures.");
        }
    }

    private void ensureCanView(Lecture lecture) {
        if (hasAnyRole("ADMIN", "SUPER_ADMIN")) {
            return;
        }
        if (hasRole("TEACHER")) {
            ensureTeacherOwnsProfile(lecture.getTeacherProfile());
            return;
        }
        throw new ForbiddenException("Not allowed to view lectures.");
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_" + role));
    }

    private boolean hasAnyRole(String... roles) {
        for (String role : roles) {
            if (hasRole(role)) {
                return true;
            }
        }
        return false;
    }

    private LectureResponse toResponse(Lecture lecture) {
        LectureResponse response = new LectureResponse();
        response.setId(lecture.getId());
        response.setLectureTitle(lecture.getLectureTitle());
        response.setLectureAudioUrl(lecture.getLectureAudioUrl());
        response.setScore(lecture.getScore());
        response.setUploadedAt(lecture.getUploadedAt());
        response.setTeacherProfileId(lecture.getTeacherProfile().getId());
        response.setClassSlotId(lecture.getClassSlot() != null ? lecture.getClassSlot().getId() : null);
        return response;
    }
}
