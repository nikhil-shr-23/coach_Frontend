package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.dto.UserCreateRequest;
import com.raghav.peadologicalbackend.dto.UserResponse;
import com.raghav.peadologicalbackend.dto.UserUpdateRequest;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementService {
    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final TimetableRepository timetableRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (request.getRole() == null) {
            throw new BadRequestException("Role is required.");
        }
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new BadRequestException("Email already exists.");
        });

        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRoles(request.getRole());
        user = userRepository.save(user);

        if (request.getRole() == Roles.TEACHER) {
            TeacherProfile profile = new TeacherProfile();
            profile.setUser(user);
            profile = teacherProfileRepository.save(profile);

            Timetable timetable = new Timetable();
            timetable.setTeacherProfile(profile);
            timetableRepository.save(timetable);
        }

        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse get(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found."));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found."));

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                throw new BadRequestException("Email already exists.");
            });
            user.setEmail(request.getEmail());
            user.setUsername(request.getEmail());
        }
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPassword() != null) {
            user.setPassword(encoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && request.getRole() != user.getRoles()) {
            if (user.getRoles() == Roles.TEACHER && request.getRole() != Roles.TEACHER) {
                throw new BadRequestException("Cannot change role from TEACHER without removing profile first.");
            }
            user.setRoles(request.getRole());
            if (request.getRole() == Roles.TEACHER) {
                ensureTeacherProfile(user);
            }
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found."));

        teacherProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
            timetableRepository.findByTeacherProfileId(profile.getId())
                    .ifPresent(timetableRepository::delete);
            teacherProfileRepository.delete(profile);
        });

        userRepository.delete(user);
    }

    private void ensureTeacherProfile(Users user) {
        teacherProfileRepository.findByUserId(user.getId()).ifPresentOrElse(
                existing -> {
                },
                () -> {
                    TeacherProfile profile = new TeacherProfile();
                    profile.setUser(user);
                    profile = teacherProfileRepository.save(profile);

                    Timetable timetable = new Timetable();
                    timetable.setTeacherProfile(profile);
                    timetableRepository.save(timetable);
                }
        );
    }

    private UserResponse toResponse(Users user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRoles());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
