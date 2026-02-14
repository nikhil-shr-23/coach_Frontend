package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.dto.TeacherProfileCreateRequest;
import com.raghav.peadologicalbackend.dto.TeacherProfileResponse;
import com.raghav.peadologicalbackend.entity.Roles;
import com.raghav.peadologicalbackend.entity.TeacherProfile;
import com.raghav.peadologicalbackend.entity.Timetable;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.exception.BadRequestException;
import com.raghav.peadologicalbackend.exception.NotFoundException;
import com.raghav.peadologicalbackend.repository.TeacherProfileRepository;
import com.raghav.peadologicalbackend.repository.TimetableRepository;
import com.raghav.peadologicalbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherProfileService {
    private final TeacherProfileRepository teacherProfileRepository;
    private final TimetableRepository timetableRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeacherProfileResponse create(TeacherProfileCreateRequest request) {
        Users user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found."));
        if (user.getRoles() != Roles.TEACHER) {
            throw new BadRequestException("User is not a TEACHER.");
        }
        teacherProfileRepository.findByUserId(user.getId()).ifPresent(existing -> {
            throw new BadRequestException("Teacher profile already exists.");
        });

        TeacherProfile profile = new TeacherProfile();
        profile.setUser(user);
        profile = teacherProfileRepository.save(profile);

        Timetable timetable = new Timetable();
        timetable.setTeacherProfile(profile);
        timetableRepository.save(timetable);

        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public TeacherProfileResponse get(Long id) {
        TeacherProfile profile = teacherProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Teacher profile not found."));
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<TeacherProfileResponse> list() {
        return teacherProfileRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        TeacherProfile profile = teacherProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Teacher profile not found."));
        timetableRepository.findByTeacherProfileId(profile.getId())
                .ifPresent(timetableRepository::delete);
        teacherProfileRepository.delete(profile);
    }

    private TeacherProfileResponse toResponse(TeacherProfile profile) {
        TeacherProfileResponse response = new TeacherProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setSchool(profile.getSchool());
        response.setDepartment(profile.getDepartment());
        response.setName(profile.getUser().getName());
        response.setEmail(profile.getUser().getEmail());
        return response;
    }

    @Transactional(readOnly = true)
    public TeacherProfileResponse getProfileForCurrentUser() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found: " + username));
        
        TeacherProfile profile = teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Teacher profile not found for user: " + username));
        
        return toResponse(profile);
    }
}
