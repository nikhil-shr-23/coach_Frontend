package com.raghav.peadologicalbackend.repository;

import com.raghav.peadologicalbackend.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    Optional<Timetable> findByTeacherProfileId(Long teacherProfileId);
}
