package com.raghav.peadologicalbackend.repository;

import com.raghav.peadologicalbackend.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByUserId(Long userId);

    @Query("SELECT t.school, COUNT(t) FROM TeacherProfile t GROUP BY t.school")
    List<Object[]> countFacultyBySchool();

    List<TeacherProfile> findBySchool(String school);
}
